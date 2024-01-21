import orderModel from "../model/Order";
import cartModel from "../model/Cart";
import { v4 as uuidv4 } from 'uuid';

async function orders(customerId:string){

    const orders = await orderModel.find({customerId });
    
    return orders;

}

async function cart(customerId:string){

    const cartItems = await cartModel.find({ customerId: customerId });


    if(cartItems){
        return cartItems;
    }

    throw new Error('Data Not found!');
}

async function addCartItem(customerId:string,item:any,qty:number,isRemove:any){

        // return await CartModel.deleteMany();

        const cart = await cartModel.findOne({ customerId: customerId })

        const { _id } = item;

        if(cart){
            
            let isExist = false;

            let cartItems = cart.items;


            if(cartItems.length > 0){

                cartItems.map((item :any) => {
                                            
                    if(item.product._id.toString() === _id.toString()){
                        if(isRemove){
                            cartItems.splice(cartItems.indexOf(item), 1);
                         }else{
                           item.unit = qty;
                        }
                         isExist = true;
                    }
                });
            } 
            
            if(!isExist && !isRemove){
                cartItems.push({product: { ...item}, unit: qty });
            }

            cart.items = cartItems;

            return await cart.save()

        }else{

           return await cartModel.create({
                customerId,
                items:[{product: { ...item}, unit: qty }]
            })
        }

    
}


async function createNewOrder(customerId:string, txnId:string){

    //required to verify payment through TxnId

    const cart:any = await cartModel.findOne({ customerId: customerId })

    if(cart){         
        
        let amount = 0;   

        let cartItems = cart.items;

        if(cartItems.length > 0){
            //process Order
            
            cartItems.map((item:any) => {
                amount += parseInt(item.product.price) *  parseInt(item.unit);   
            });

            const orderId = uuidv4();

            const order = new orderModel({
                orderId,
                customerId,
                amount,
                status: 'received',
                items: cartItems
            })

            cart.items  = [];
            
            const orderResult = await order.save();
            await cart.save();
            return orderResult;


        }



    }

    return {}
}

export default{
    orders,
    cart,
    addCartItem,
    createNewOrder
}
