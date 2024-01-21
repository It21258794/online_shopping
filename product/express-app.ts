import cors from "cors";
import express from "express";
import ProductApi from "./src/api/product";
import { createChannel } from "./src/utils/utils";

export const expressApp =async (app:any) => {
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    const channel = await createChannel()
    ProductApi(app,channel)
}