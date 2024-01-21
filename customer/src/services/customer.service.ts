import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utils/utils';
import customerRepo from '../database/repository/customer.repository';

async function SignIn(userInputs: any) {
  const { email, password } = userInputs;

  const existingCustomer = await customerRepo.findCustomer({ email });

  if (existingCustomer) {
    const validPassword = await ValidatePassword(
      password,
      existingCustomer.password as string,
      existingCustomer.salt as string,
    );
    if (validPassword) {
      const token = await GenerateSignature({
        email: existingCustomer.email,
        _id: existingCustomer._id,
      });
      return FormateData({ id: existingCustomer._id, token });
    }
  }

  return FormateData(null);
}

async function SignUp(userInputs: any) {
  const { email, password, phone } = userInputs;

  // create salt
  let salt = await GenerateSalt();

  let userPassword = await GeneratePassword(password, salt);

  const existingCustomer = await customerRepo.createCustomer({
    email,
    password: userPassword,
    phone,
    salt,
  });

  const token = await GenerateSignature({
    email: email,
    _id: existingCustomer._id,
  });
  return FormateData({ id: existingCustomer._id, token });
}

async function addNewAddress(_id: string, userInputs: any) {
  const { street, postalCode, city, country } = userInputs;

  const addressResult = await customerRepo.createAddress({
    _id,
    street,
    postalCode,
    city,
    country,
  });

  return FormateData(addressResult);
}

async function getProfile(id: any) {
  const existingCustomer = await customerRepo.findCustomerById({ id });
  return FormateData(existingCustomer);
}

async function getShopingDetails(id: any) {
  const existingCustomer = await customerRepo.findCustomerById({ id });

  if (existingCustomer) {
    // const orders = await this.shopingRepository.Orders(id);
    return FormateData(existingCustomer);
  }
  return FormateData({ msg: 'Error' });
}

async function getWishList(customerId: string) {
  const wishListItems = await customerRepo.wishlist(customerId);
  return FormateData(wishListItems);
}

async function addToWishlist(customerId: string, product: any) {
  const wishlistResult = await customerRepo.addWishlistItem(
    customerId,
    product,
  );
  return FormateData(wishlistResult);
}

async function manageCart(
  customerId: string,
  product: any,
  qty: number,
  isRemove: any,
) {
  const cartResult = await customerRepo.addCartItem(
    customerId,
    product,
    qty,
    isRemove,
  );
  return FormateData(cartResult);
}

async function manageOrder(customerId: string, order: any) {
  const orderResult = await customerRepo.addOrderToProfile(customerId, order);
  return FormateData(orderResult);
}

async function subscribeEvents(payload: any) {
  console.log('Triggering.... Customer Events');

  payload = JSON.parse(payload);

  const { event, data } = payload;

  const { userId, product, order, qty } = data;

  switch (event) {
    case 'ADD_TO_WISHLIST':
    case 'REMOVE_FROM_WISHLIST':
      addToWishlist(userId, product);
      break;
    case 'ADD_TO_CART':
      manageCart(userId, product, qty, false);
      break;
    case 'REMOVE_FROM_CART':
      manageCart(userId, product, qty, true);
      break;
    case 'CREATE_ORDER':
      manageOrder(userId, order);
      break;
    default:
      break;
  }
}

export default {
  SignIn,
  SignUp,
  subscribeEvents,
  manageOrder,
  manageCart,
  addToWishlist,
  getWishList,
  getShopingDetails,
  getProfile,
  addNewAddress,
};
