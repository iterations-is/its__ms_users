import { Router, Response, Request } from 'express';

export const internalRouter = Router();

internalRouter.post('/users', (req: Request, res: Response) => {
	res.json({ info: 'success user creation' });
});

internalRouter.get('/users/:userId', (req: Request, res: Response) => {
	const { userId } = req.params;

	res.json({ info: `success search ${userId}` });
});
