import { Request, Response } from 'express';
import { prisma } from '../../utils';

export const epSelfDelete = async (req: Request, res: Response) => {
	const userId = res.locals.userId;

	let userData;
	try {
		userData = await prisma.user.findUnique({
			where: { id: userId },
		});
	} catch (error) {
		return res.status(500).json({ message: 'internal server error' });
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

		return res.status(200).json({ message: 'user was disabled forever' });
	} catch (error) {
		return res.status(500).json({ message: 'internal server error' });
	}
};
