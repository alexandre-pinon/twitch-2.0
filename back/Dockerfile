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


RUN npm install

COPY . .

RUN npm run unittest
# If you are building your code for production
RUN npm ci --only=production

#jesuiscrever

# copy the dependencies file to the working directory

# application expose port
EXPOSE 8001

HEALTHCHECK --interval=1m --timeout=30s --retries=3 CMD curl --fail http://localhost:8001 || exit 1
# command to run on container start
CMD ["node", "server.js"]