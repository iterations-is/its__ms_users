import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

import { UserSearchReqDTO, UserSearchReqDTOSchema } from '../../dto';

const prisma = new PrismaClient();

export const epSearchUser = async (req: Request, res: Response) => {
	// Validation
	const userSearchReq: UserSearchReqDTO = req.body;
	const { error } = UserSearchReqDTOSchema.validate(userSearchReq);
	if (error) return res.status(400).json(error);

	// Search
	try {
		const user = await prisma.user.findUnique({
			where: {
				...userSearchReq,
			},
		});

		if (!user) return res.status(404).json({ message: 'user not found' });

		return res.status(200).json({ message: 'user data', payload: user });
	} catch (err) {
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			// TODO: special error cases
			// Not unique email
			// Not unique username
			// Invalid password
		}

		return res.status(400).json({ payload: err });
	}
};
