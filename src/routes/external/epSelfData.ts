import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { pick } from 'lodash';

const prisma = new PrismaClient();

/**
 * Requires mwAuthorization
 */
export const epSelfData = async (req: Request, res: Response) => {
	const userId = res.locals.userId;

	try {
		const userData = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!userData) return res.status(404).json({ error: 'User not found' });

		const data = pick(userData, ['email', 'name', 'username']);

		return res.status(200).json({ payload: data });
	} catch (err) {
		return res.status(500).json({ payload: err });
	}
};
