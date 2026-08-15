import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { HttpError } from './error';

/** Validates and replaces req.body with the parsed result, 400 on failure. */
export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(new HttpError(400, 'Validation failed', result.error.flatten()));
      return;
    }
    req.body = result.data;
    next();
  };
