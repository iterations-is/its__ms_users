import { Request, Response } from 'express';
import { UpdatePasswordReqDTO, UpdatePasswordReqDTOSchema } from '../../dto';
import bcrypt from 'bcryptjs';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const epUpdatePassword = async (req: Request, res: Response) => {
	// Validation
	const updatePasswordReq: UpdatePasswordReqDTO = req.body;
	const { error } = UpdatePasswordReqDTOSchema.validate(updatePasswordReq);
	if (error) return res.status(400).json(error);

	// Processing
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(updatePasswordReq.password, salt);

	try {
		await prisma.user.update({
			where: {
				id: req.params.userId,
			},
			data: {
				password: hash,
			},
		});

		return res.status(200).json({ message: 'password was updated' });
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
