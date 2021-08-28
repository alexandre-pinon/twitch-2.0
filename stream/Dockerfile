FROM node:14.17.2-buster-slim

# set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Update npm
RUN npm install npm@latest -g
RUN npm install npm@latest -g


RUN npm install --production
# If you are building your code for production
RUN npm ci --only=production

# copy the dependencies file to the working directory
COPY . .

# application expose port
EXPOSE 1935
EXPOSE 8003

# command to run on container start
CMD [ "node", "app.js" ]