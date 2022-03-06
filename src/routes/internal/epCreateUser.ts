import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { Prisma, PrismaClient } from '@prisma/client';

import { SignUpReqDTO, SignUpReqDTOSchema } from '../../dto';

const prisma = new PrismaClient();

export const epCreateUser = async (req: Request, res: Response) => {
	// Validation
	const signUpReq: SignUpReqDTO = req.body;
	const { error } = SignUpReqDTOSchema.validate(signUpReq);
	if (error) return res.status(400).json(error);

	// Processing
	const salt = await bcrypt.genSalt(10);
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
		});

		const userResponse = omit(user, ['password']);

		return res.status(200).json({ payload: userResponse });
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			// TODO: special error cases
			// Not unique email
			// Not unique username
			// Invalid password
			return res.status(400).json({ payload: err });
		}

		return res.status(500).json({ payload: err });
	}
};
