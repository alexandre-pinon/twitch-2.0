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

RUN npm install serve -g

RUN npm install --production
# If you are building your code for production
RUN npm ci --only=production

# copy the dependencies file to the working directory
COPY . .

#jesuiscrever


# application expose port
EXPOSE 3000
EXPOSE 8003
EXPOSE 5000


HEALTHCHECK --interval=1m --timeout=30s --retries=3 CMD curl --fail http://localhost:3000 || exit 1
# command to run on container start
CMD [ "npm", "start" ]
