import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { expressApp } from './express-app';
import { connection } from './src/database/connection';

//For env File 
dotenv.config();

const app: Application = express();
connection()
const port = process.env.PORT;
expressApp(app);



app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

