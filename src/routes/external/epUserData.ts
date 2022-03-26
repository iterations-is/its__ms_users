import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../../utils';

export const epUserData = async (req: Request, res: Response) => {
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

		if (!userData) return res.status(404).json({ error: 'User not found' });

		const gravatar = crypto.createHash('md5').update(userData.email).digest('hex');

		return res.status(200).json({
			payload: {
				...userData,
				gravatar: `https://www.gravatar.com/avatar/${gravatar}`,
			},
		});
	} catch (err) {
		return res.status(500).json({ payload: err });
	}
};
