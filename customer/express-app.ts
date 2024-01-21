import cors from "cors";
import express from "express";
import customerApi from "./src/api/customer";
import dotenv from 'dotenv';
import { createChannel } from "./src/utils/utils";

export const expressApp =async (app:any) => {

   
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))
    
    const channel = await createChannel()
    customerApi(app,channel);
}