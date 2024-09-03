FROM node:11-alpine

COPY . .

RUN npm install

CMD ["npm", "run", "start"]     