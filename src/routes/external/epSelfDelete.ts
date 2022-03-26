import { Request, Response } from 'express';
import { prisma } from '../../utils';
import { logger } from '../../broker';
import { MS_NAME } from '../../constants';
import { BrokerMessageLog, MessageDTO } from '@its/ms';

export const epSelfDelete = async (req: Request, res: Response) => {
	const userId = res.locals.userId;

	let userData;
	try {
		userData = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userData) {
			logger.send({
				createdAt: new Date(),
				description: `user "${userId}" tried to delete itself but his UUID doesnt exist at all`,
				ms: MS_NAME,
			} as BrokerMessageLog);

			return res.status(400).json({ message: 'user does not exist' } as MessageDTO);
		}
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `user "${userId}" tried to delete itself but failed`,
			ms: MS_NAME,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error' } as MessageDTO);
	}

	try {
		await prisma.user.update({
			where: { id: userId },
			data: {
				email: `${userData.id}@example.com`,
				name: 'Anonymous',
				password: '',
				username: userData.id,
				role: {
					connect: {
						name: 'banned',
					},
				},
			},
		});

		logger.send({
			createdAt: new Date(),
			description: `user "${userId}" removed account`,
			ms: MS_NAME,
		} as BrokerMessageLog);

		return res.status(200).json({ message: 'user was disabled forever' } as MessageDTO);
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `user "${userId}" wanted to remove account but failed`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ message: 'internal server error' } as MessageDTO);
	}
};
