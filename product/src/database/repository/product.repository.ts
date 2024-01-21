import { AnyExpression } from 'mongoose';
import productModel from '../model/Product';

async function createProduct({
  name,
  desc,
  type,
  unit,
  price,
  available,
  suplier,
  banner,
}: any) {
  const product = new productModel({
    name,
    desc,
    type,
    unit,
    price,
    available,
    suplier,
    banner,
  });

  //    return await ProductModel.findByIdAndDelete('607286419f4a1007c1fa7f40');

  const productResult = await product.save();
  return productResult;
}

async function products() {
  return await productModel.find();
}

async function findById(id: string) {
  return await productModel.findById(id);
}

async function findByCategory(category: any) {
  const products = await productModel.find({ type: category });

  return products;
}

async function findSelectedProducts(selectedIds: any) {
  const products = await productModel
    .find()
    .where('_id')
    .in(selectedIds.map((_id: any) => _id))
    .exec();
  return products;
}

export default {
  findSelectedProducts,
  findByCategory,
  findById,
  products,
  createProduct,
};
