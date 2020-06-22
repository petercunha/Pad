FROM node

WORKDIR /home/node/app
COPY . .
RUN yarn install --production

CMD ["yarn", "start"]
