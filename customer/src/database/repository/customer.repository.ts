import customerModel from '../model/Customer';
import addressModel from '../model/Address';

async function createCustomer({ email, password, phone, salt }: any) {
  const customer = new customerModel({
    email,
    password,
    salt,
    phone,
    address: [],
  });

  const customerResult = await customer.save();
  return customerResult;
}

async function createAddress({ _id, street, postalCode, city, country }: any) {
  const profile = await customerModel.findById(_id);

  if (profile) {
    const newAddress: any = new addressModel({
      street,
      postalCode,
      city,
      country,
    });

    await newAddress.save();

    profile.address.push(newAddress);
    await profile.save();
  }
  return profile;
}

async function findCustomer({ email }: any) {
  const existingCustomer = await customerModel.findOne({ email: email });
  return existingCustomer;
}

async function findCustomerById({ id }: any) {
  const existingCustomer = await customerModel.findById(id).populate('address');
  // existingCustomer.cart = [];
  // existingCustomer.orders = [];
  // existingCustomer.wishlist = [];

  // await existingCustomer.save();
  return existingCustomer;
}

async function wishlist(customerId: string) {
  const profile = await customerModel.findById(customerId).populate('wishlist');
  if (!profile) {
    throw 'Profile not found';
  }
  return profile.wishlist;
}

async function addWishlistItem(
  customerId: string,
  { _id, name, desc, price, available, banner }: any,
) {
  let profileResult: any;
  const product = {
    _id,
    name,
    desc,
    price,
    available,
    banner,
  };

  const profile = await customerModel.findById(customerId).populate('wishlist');

  if (profile) {
    let wishlist = profile.wishlist;

    if (wishlist.length > 0) {
      let isExist = false;
      wishlist.map((item) => {
        if (item._id?.toString() === product._id.toString()) {
          const index = wishlist.indexOf(item);
          wishlist.splice(index, 1);
          isExist = true;
        }
      });

      if (!isExist) {
        wishlist.push(product);
      }
    } else {
      wishlist.push(product);
    }

    profile.wishlist = wishlist;
    profileResult = await profile.save();
  }

  return profileResult.wishlist;
}

async function addCartItem(
  customerId: string,
  { _id, name, price, banner }: any,
  qty: number,
  isRemove: any,
) {
  const profile = await customerModel.findById(customerId).populate('cart');

  if (profile) {
    const cartItem = {
      product: { _id, name, price, banner },
      unit: qty,
    };

    let cartItems = profile.cart;

    if (cartItems.length > 0) {
      let isExist = false;
      cartItems.map((item) => {
        if (item.product?._id?.toString() === _id.toString()) {
          if (isRemove) {
            cartItems.splice(cartItems.indexOf(item), 1);
          } else {
            item.unit = qty;
          }
          isExist = true;
        }
      });

      if (!isExist) {
        cartItems.push(cartItem);
      }
    } else {
      cartItems.push(cartItem);
    }

    profile.cart = cartItems;

    return await profile.save();
  }

  throw new Error('Unable to add to cart!');
}

async function addOrderToProfile(customerId: string, order: any) {
  const profile: any = await customerModel.findById(customerId);

  if (profile) {
    if (profile.orders == undefined) {
      profile.orders = [];
    }
    profile.orders.push(order);

    profile.cart = [];

    const profileResult = await profile.save();

    return profileResult;
  }

  throw new Error('Unable to add to order!');
}

export default {
  createCustomer,
  findCustomer,
  createAddress,
  findCustomerById,
  wishlist,
  addWishlistItem,
  addCartItem,
  addOrderToProfile,
};
