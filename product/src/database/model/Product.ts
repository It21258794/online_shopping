import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    banner: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    unit: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    available: {
      type: Boolean,
      require: true,
    },
    suplier: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);
export default Product;
