import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../utils';
import { logger } from '../../broker';
import { MS_NAME } from '../../constants';
import { BrokerMessageLog, MessageDTO } from '@its/ms';

export const epUserData = async (req: Request, res: Response) => {
	const userId = res.locals.userId;
	const foreignUserId = req.params.userId;

	try {
		const userData = await prisma.user.findUnique({
			where: { id: foreignUserId },
			select: {
				id: true,
				name: true,
				username: true,
				email: true,
				role: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!userData)
			return res.status(404).json({
				error: 'User not found',
			} as MessageDTO);

		const gravatar = crypto.createHash('md5').update(userData.email).digest('hex');

		return res.status(200).json({
			payload: {
				...userData,
				gravatar: `https://www.gravatar.com/avatar/${gravatar}`,
			},
		});
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `user "${userId}" asked for data of user "${foreignUserId}" but failed`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error', payload: error } as MessageDTO);
	}
};
