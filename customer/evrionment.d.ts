import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        APP_SECRET: Secret;
        PORT?: string;
        APP_ACCESS_TOKEN_EXP_SECS: any;
        DB_URL:any,
        MSG_QUEUE_URL:any,
        EXCHANGE_NAME:string,
        CUSTOMER_SERVICE:string,
        SHOPPING_SERVICE :string
      }
    }
  }

  export {};