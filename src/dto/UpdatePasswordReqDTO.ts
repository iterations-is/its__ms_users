import Joi from 'joi';

export interface UpdatePasswordReqDTO {
	password: string;
}

export const UpdatePasswordReqDTOSchema: Joi.ObjectSchema = Joi.object({
	password: Joi.string().min(8).required(),
});
