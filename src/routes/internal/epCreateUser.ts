import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { omit, get } from 'lodash';
import { Prisma } from '@prisma/client';
import { SignUpReqDTO, SignUpReqDTOSchema } from '../../dto';
import { prisma } from '../../utils';
import { BrokerMessageLog, MessageDTO } from '@its/ms';
import { logger } from '../../broker';
import { BCRYPT_SALT_ROUNDS, MS_NAME } from '../../constants';

export const epCreateUser = async (req: Request, res: Response) => {
	// Validation
	const signUpReq: SignUpReqDTO = req.body;
	const { error } = SignUpReqDTOSchema.validate(signUpReq);
	if (error) return res.status(400).json(error);

	// Processing
	const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
	const hash = await bcrypt.hash(signUpReq.password, salt);

	try {
		const user = await prisma.user.create({
			data: {
				name: signUpReq.name,
				email: signUpReq.email,
				username: signUpReq.username,
				password: hash,
				role: {
					connect: {
						name: 'user',
					},
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
				username: true,
				role: {
					select: {
						name: true,
					},
				},
			},
		});

		const userResponse = omit(user, ['password']);

		return res.status(200).json({
			message: 'user data',
			payload: userResponse,
		} as MessageDTO);
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			// unique email
			if (err.code === 'P2002' && get(err, 'meta.target')?.[0] === 'email') {
				return res.status(400).json({
					code: 'UNIQUE_EMAIL',
					message: 'email already exists',
				});
			}

			// unique username
			if (err.code === 'P2002' && get(err, 'meta.target')?.[0] === 'username') {
				return res.status(400).json({
					code: 'UNIQUE_USERNAME',
					message: 'username already exists',
				});
			}

			return res.status(400).json({
				message: 'cannot create new user',
				payload: err,
			});
		}

		logger.send({
			createdAt: new Date(),
			description: `cannot create a user`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error', payload: error } as MessageDTO);
	}
};
