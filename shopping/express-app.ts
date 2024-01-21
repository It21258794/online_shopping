import cors from "cors";
import express from "express";
import shoppingApi from "./src/api/shopping";
import { createChannel } from "./src/utils/utils";

export const expressApp =async (app:any) => {
    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    const channel = await createChannel()
    shoppingApi(app,channel)

}