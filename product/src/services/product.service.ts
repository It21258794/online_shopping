import productRepo from '../database/repository/product.repository';
import { FormateData } from '../utils/utils';

async function createProduct(productInputs: any) {
  const productResult = await productRepo.createProduct(productInputs);
  return FormateData(productResult);
}

async function getProducts() {
  const products = await productRepo.products();

  let categories = {};

  // products.map(({ type  }) => {
  //     categories[type] = type;
  // });

  return FormateData({
    products,
    categories: Object.keys(categories),
  });
}

async function getProductDescription(productId: string) {
  const product = await productRepo.findById(productId);
  return FormateData(product);
}

async function getProductsByCategory(category: any) {
  const products = await productRepo.findByCategory(category);
  return FormateData(products);
}

async function getSelectedProducts(selectedIds: any) {
  const products = await productRepo.findSelectedProducts(selectedIds);
  return FormateData(products);
}

async function getProductPayload(
  userId: string,
  { productId, qty }: any,
  event: any,
) {
  const product = await productRepo.findById(productId);

  if (product) {
    const payload = {
      event: event,
      data: { userId, product, qty },
    };

    return FormateData(payload);
  } else {
    return FormateData({ error: 'No product Available' });
  }
}

export default {
  createProduct,
  getProducts,
  getProductDescription,
  getProductsByCategory,
  getSelectedProducts,
  getProductPayload,
};
