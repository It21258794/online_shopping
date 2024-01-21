import { NextFunction, Request, Response } from 'express';
import customerService from '../services/customer.service';
import AuthGuard from './middleware/auth';
import { subscribeMessage } from '../utils/utils';

const customerApi = (app: any,channel:any) => {

  subscribeMessage(channel, customerService);

  app.post(
    '/signup',
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, phone } = req.body;
      const { data } = await customerService.SignUp({ email, password, phone });
      res.json(data);
    },
  );

  app.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const { data } = await customerService.SignIn({ email, password });

      res.json(data);
    },
  );

  app.post(
    '/address',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await customerService.addNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });

      res.json(data);
    },
  );

  app.get(
    '/profile',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const { data } = await customerService.getProfile({ _id });
      res.json(data);
    },
  );

  app.get(
    '/shoping-details',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const { data } = await customerService.getShopingDetails(_id);

      return res.json(data);
    },
  );

  app.get(
    '/wishlist',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const { data } = await customerService.getWishList(_id);
      return res.status(200).json(data);
    },
  );

  app.get('/whoami', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ msg: '/customer : I am Customer Service' });
  });
};

export default customerApi;
