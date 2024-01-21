import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import amqplib from "amqplib";

declare module 'express-serve-static-core' {
  interface Request {
    user: any;
  }
}

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string,
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSignature = async (payload: any) => {
  try {
    if (!process.env.APP_SECRET) {
      throw new Error('APP_SECRET is not defined');
    }
    return jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const ValidateSignature = async (req: Request, res: Response) => {
  try {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res.status(400).send({
        err: 'Forbinded Resources1',
      });
    }
    if (!process.env.APP_SECRET) {
      throw new Error('APP_SECRET is not defined');
    }

    const payload = jwt.verify(
      authToken.split('Bearer ')[1],
      process.env.APP_SECRET,
    );
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const FormateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error('Data Not found!');
  }
};

export const createChannel = async () => {
  try {
    if (!process.env.MSG_QUEUE_URL) {
      throw new Error('MSG_QUEUE_URL is not defined');
    }
    console.log(process.env.MSG_QUEUE_URL)
    const connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
    console.log('chanel ok')
    const channel = await connection.createChannel();
    if (!process.env.EXCHANGE_NAME) {
      throw new Error('EXCHANGE_NAME is not defined');
    }
    await channel.assertQueue(process.env.EXCHANGE_NAME, { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

export const publishMessage = (channel:any, service:any, msg:any) => {
  channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};

export const subscribeMessage = async (channel:any, service:any) => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, process.env.SHOPPING_SERVICE);

  channel.consume(
    q.queue,
    (msg:any) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};