// validation.ts
import Joi from "joi";


export const validationSchemas: Record<string, Joi.ObjectSchema> = {
  User: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role_id: Joi.string().required(),
    point: Joi.number().integer().min(0).required(),
  }),

  BlogCategory: Joi.object({
    name: Joi.string().required(),
  }),
  Blog: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
    category_id: Joi.string().uuid().required(),
    file_id: Joi.string().uuid().optional(),
    user_id:Joi.string().uuid().required()
  }),
  File: Joi.object({
    url: Joi.string().uri().optional(),
    description: Joi.string().optional(),
    path: Joi.string().optional(),
  }),
  Role:Joi.object({
    name:Joi.string().required()
  })
};
