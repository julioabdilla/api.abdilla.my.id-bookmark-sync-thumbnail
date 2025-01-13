FROM node:lts-alpine AS build
WORKDIR /app
RUN npm i -g @nestjs/cli
COPY package*.json .
COPY yarn* .
RUN yarn install
COPY . .
RUN yarn build

FROM node:lts-alpine AS run
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*
COPY package*.json .
COPY yarn* .
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main.js"]
