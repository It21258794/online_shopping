import { NextFunction, Request, Response } from 'express';
import { ValidateSignature } from '../../utils/utils';
const AuthGuard = async (req: Request, res: Response, next: NextFunction) => {
  const isAuthorized = await ValidateSignature(req, res);

  if (isAuthorized) {
    return next();
  }
  return res.status(403).json({ message: 'Not Authorized' });
};

export default AuthGuard;
