# pull the official base image
FROM node:18-alpine

WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json package-lock.json ./

RUN npm install
# add app
COPY . ./
# start app
CMD ["npm", "start"]