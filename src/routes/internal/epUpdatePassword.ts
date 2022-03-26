import { Request, Response } from 'express';
import { UpdatePasswordReqDTO, UpdatePasswordReqDTOSchema } from '../../dto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../utils';
import { BrokerMessageLog, MessageDTO } from '@its/ms';
import { logger } from '../../broker';
import { MS_NAME, BCRYPT_SALT_ROUNDS } from '../../constants';

export const epUpdatePassword = async (req: Request, res: Response) => {
	// Validation
	const updatePasswordReq: UpdatePasswordReqDTO = req.body;
	const { error } = UpdatePasswordReqDTOSchema.validate(updatePasswordReq);
	if (error) return res.status(400).json(error);

	const foreignUserId = req.params.userId;

	try {
		// Processing
		const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
		const hash = await bcrypt.hash(updatePasswordReq.password, salt);

		await prisma.user.update({
			where: {
				id: foreignUserId,
			},
			data: {
				password: hash,
			},
		});

		return res.status(200).json({ message: 'password was updated' });
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `cannot update user "${foreignUserId}" password`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error', payload: error } as MessageDTO);
	}
};
