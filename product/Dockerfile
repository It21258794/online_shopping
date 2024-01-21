FROM node

WORKDIR /app/product

COPY package.json .

RUN npm install

COPY . .
RUN npm run build
EXPOSE 8001

CMD ["npm", "start"]