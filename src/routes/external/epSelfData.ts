import { Request, Response } from 'express';
import { pick } from 'lodash';
import { prisma } from '../../utils';
import { logger } from '../../broker';
import { MS_NAME } from '../../constants';
import { BrokerMessageLog } from '@its/ms';

export const epSelfData = async (req: Request, res: Response) => {
	const userId = res.locals.userId;

	try {
		const userData = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userData) return res.status(404).json({ error: 'User not found' });

		const data = pick(userData, ['id', 'email', 'name', 'username']);

		return res.status(200).json({ payload: data });
	} catch (error) {
		logger.send({
			createdAt: new Date(),
			description: `User with "${userId}" from JWT asked for self data but failed`,
			ms: MS_NAME,
			data: error,
		} as BrokerMessageLog);

		return res.status(500).json({ payload: error });
	}
};
