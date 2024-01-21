import shoppingRepo from "../database/repository/shopping.repository";
import { FormateData } from "../utils/utils";

async function getCart({ _id }:any){
        
    const cartItems = await shoppingRepo.cart(_id);
    return FormateData(cartItems);
}


async function placeOrder(userInput:any){

    const { _id, txnNumber } = userInput

    const orderResult = await shoppingRepo.createNewOrder(_id, txnNumber);
    
    return FormateData(orderResult);
}

async function getOrders(customerId:string){
    
    const orders = await shoppingRepo.orders(customerId);
    return FormateData(orders)
}

async function getOrderDetails({ _id,orderId }:any){
    const orders = await shoppingRepo.orders(_id);
    return FormateData(orders)
}

async function manageCart(customerId:string, item:any,qty:number, isRemove:any){

    const cartResult = await shoppingRepo.addCartItem(customerId,item,qty, isRemove);
    return FormateData(cartResult);
}
 

async function subscribeEvents(payload:any){

    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;
    
    switch(event){
        case 'ADD_TO_CART':
            manageCart(userId,product, qty, false);
            break;
        case 'REMOVE_FROM_CART':
            manageCart(userId,product, qty, true);
            break;
        default:
            break;
    }

}


async function getOrderPayload(userId:string,order:any,event:any){

   if(order){
        const payload = { 
           event: event,
           data: { userId, order }
       };

        return payload
   }else{
       return FormateData({error: 'No Order Available'});
   }

}

export default{
    getCart,
    placeOrder,
    getOrders,
    getOrderDetails,
    getOrderPayload,
    manageCart
}