import { NextFunction, Request, Response } from 'express';
import productService from '../services/product.service';
import AuthGuard from './middleware/auth';
import { publishMessage } from '../utils/utils';

const ProductApi = (app: any,channel:any) => {
  app.post(
    '/product/create',
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      // validation
      const { data } = await productService.createProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      return res.json(data);
    },
  );

  app.get(
    '/category/:type',
    async (req: Request, res: Response, next: NextFunction) => {
      const type = req.params.type;

      try {
        const { data } = await productService.getProductsByCategory(type);
        return res.status(200).json(data);
      } catch (error) {
        return res.status(404).json({ error });
      }
    },
  );

  app.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.id;

    try {
      const { data } = await productService.getProductDescription(productId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });

  app.post('/ids', async (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.body;
    const products = await productService.getSelectedProducts(ids);
    return res.status(200).json(products);
  });

  app.put(
    '/wishlist',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;

      const { data } = await productService.getProductPayload(
        _id,
        { productId: req.body._id },
        'ADD_TO_WISHLIST',
      );

      publishMessage(channel, process.env.CUSTOMER_SERVICE, JSON.stringify(data));

      res.status(200).json(data.data.product);
    },
  );

  app.delete(
    '/wishlist/:id',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const productId = req.params.id;

      const { data } = await productService.getProductPayload(
        _id,
        { productId },
        'REMOVE_FROM_WISHLIST',
      );
      publishMessage(channel, process.env.CUSTOMER_SERVICE, JSON.stringify(data));

      res.status(200).json(data.data.product);
    },
  );

  app.put(
    '/cart',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;

      const { data } = await productService.getProductPayload(
        _id,
        { productId: req.body._id, qty: req.body.qty },
        'ADD_TO_CART',
      );

      publishMessage(channel,  process.env.CUSTOMER_SERVICE, JSON.stringify(data));
      publishMessage(channel, process.env.SHOPPING_SERVICE, JSON.stringify(data));

      const response = { product: data.data.product, unit: data.data.qty };

      res.status(200).json(response);
    },
  );

  app.delete(
    '/cart/:id',
    AuthGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const productId = req.params.id;

      const { data } = await productService.getProductPayload(
        _id,
        { productId },
        'REMOVE_FROM_CART',
      );

      publishMessage(channel, process.env.CUSTOMER_SERVICE, JSON.stringify(data));
      publishMessage(channel, process.env.SHOPPING_SERVICE, JSON.stringify(data));

      const response = { product: data.data.product, unit: data.data.qty };

      res.status(200).json(response);
    },
  );

  app.get('/whoami', (req: Request, res: Response, next: NextFunction) => {
    return res
      .status(200)
      .json({ msg: '/ or /products : I am products Service' });
  });

  //get Top products and category
  app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    //check validation
    try {
      const { data } = await productService.getProducts();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(404).json({ error });
    }
  });
};

export default ProductApi;
