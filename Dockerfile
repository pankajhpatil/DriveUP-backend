#node image
FROM node:latest

RUN mkdir -p /usr/src/backend
#set working directory
WORKDIR /usr/src/backend

#Copy both package.json and package-lock.json
COPY package.json /usr/src/backend

#Install dependencies
RUN npm install

#Copy everything from here to container
COPY . .

#Specify port it runs on
EXPOSE 3001

RUN npm build
#Command to run our app
CMD ["npm", "start"]
