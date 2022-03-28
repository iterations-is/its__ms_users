import { Request, Response } from 'express';
import { prisma } from '../../utils';
import { logger } from '../../broker';
import { MS_NAME } from '../../constants';
import { BrokerMessageLog, MessageDTO } from '@its/ms';

export const epSelfData = async (req: Request, res: Response) => {
	const userId = res.locals.userId;

	try {
		const userData = await prisma.user.findUnique({
			where: { id: userId },
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

		if (!userData) return res.status(404).json({ message: 'User not found' } as MessageDTO);

		return res.status(200).json({ message: 'user data', payload: userData } as MessageDTO);
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `user "${userId}" asked for self data but failed`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error', payload: error } as MessageDTO);
	}
};
