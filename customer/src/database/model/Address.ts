import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    street: {
      type: String,
      require: true,
    },
    postalCode: {
      type: String,
      require: true,
    },
    city: {
      type: String,
      require: true,
    },
    country: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const Address = mongoose.model('Address', AddressSchema);
export default Address;
