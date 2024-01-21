import mongoose from 'mongoose';
 
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    customerId: { type: String,require: true },
    items: [
        {   
            product: {
                _id: { type: String, require: true},
                name: { type: String },
                desc: { type: String },
                banner: { type: String },
                type: { type: String },
                unit: { type: Number },
                price: { type: Number },
                suplier: { type: String },
            } ,
            unit: { type: Number, require: true} 
        }
    ]
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;