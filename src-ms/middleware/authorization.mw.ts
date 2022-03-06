import { URI_MS_AUTH } from '../../src/constants';
import axios, { AxiosResponse } from 'axios';
import { Request, Response, NextFunction } from 'express';
import { handleRestError } from '../utils';

export const mwAuthorization = async (req: Request, res: Response, next: NextFunction) => {
	const tokenHeader = req?.headers?.authorization ?? '';
	const token = tokenHeader.slice(7);

	try {
		const verifiedTokenData: AxiosResponse = await axios.post(
			`${URI_MS_AUTH}/tokens/verification`,
			{ accessToken: token }
		);
		res.locals.jwt = verifiedTokenData.data?.payload?.payload;
		res.locals.userId = verifiedTokenData.data?.payload?.payload.id;

		return next();
	} catch (error) {
		const errorData = handleRestError(error);
		return res.status(errorData[0]).json(errorData[1]);
	}
};
