import { Router, Response, Request } from 'express';

export const externalRouter = Router();

externalRouter.get('/users/self', (req: Request, res: Response) => {
	res.json({ info: 'success get self' });
});

externalRouter.delete('/users/self', (req: Request, res: Response) => {
	res.json({ info: 'success delete self' });
});
