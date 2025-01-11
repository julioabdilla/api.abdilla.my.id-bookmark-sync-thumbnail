FROM node:lts-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY .env .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY nest-cli.json .
RUN yarn install
RUN yarn build
COPY dist/ .
CMD [ "node", "dist/main.js" ]
