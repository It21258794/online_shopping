import { NextFunction, Request, Response } from "express";
import shoppingService from "../services/shopping.service";
import AuthGuard from "./middleware/auth";
import { publishMessage, subscribeMessage } from "../utils/utils";

const shoppingApi = (app:any,channel:any) =>{

    subscribeMessage(channel, shoppingService)

app.post('/order',AuthGuard, async (req:Request,res:Response,next:NextFunction) => {

    const { _id } = req.user;
    const { txnNumber } = req.body;

    const { data } = await shoppingService.placeOrder({_id, txnNumber});
    
    const payload = await shoppingService.getOrderPayload(_id, data, 'CREATE_ORDER')

    publishMessage(channel,process.env.CUSTOMER_SERVICE, JSON.stringify(payload))

    res.status(200).json(data);

});

app.get('/orders',AuthGuard, async (req:Request,res:Response,next:NextFunction) => {

    const { _id } = req.user;

    const { data } = await shoppingService.getOrders(_id);
    
    res.status(200).json(data);

});

// app.put('/cart',AuthGuard, async (req:Request,res:Response,next:NextFunction) => {

//     const { _id } = req.user;

//     const { data } = await shoppingService.addToCart(_id, req.body._id);
    
//     res.status(200).json(data);

// });

// app.delete('/cart/:id',UserAuth, async (req:Request,res:Response,next:NextFunction) => {

//     const { _id } = req.user;


//     const { data } = await service.AddToCart(_id, req.body._id);
    
//     res.status(200).json(data);

// });

app.get('/cart', AuthGuard, async (req:Request,res:Response,next:NextFunction) => {

    const { _id } = req.user;
    
    const { data } = await shoppingService.getCart({ _id });

    return res.status(200).json(data);
});

app.get('/whoami', (req:Request,res:Response,next:NextFunction) => {
    return res.status(200).json({msg: '/shoping : I am Shopping Service'})
})
}

export default shoppingApi;
