import { Request, Response } from 'express';
import { UserSearchReqDTO, UserSearchReqDTOSchema } from '../../dto';
import { prisma } from '../../utils';

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
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
				username: true,
				role: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!user) return res.status(404).json({ message: 'user not found' });

		return res.status(200).json({ message: 'user data', payload: user });
	} catch (err) {
		return res.status(500).json({ payload: err });
	}
};
