FROM node:14.17.2-buster-slim

LABEL maintainer="Sutoremondesu"
LABEL description="Docker image use for pipeline"

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8


# Set timezone to Paris by default
RUN ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime

# Install Docker 
RUN apt-get update \
    && apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release \
        git \
        sudo \
        systemd \
        openssh-server \
        openssh-client

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

RUN echo \
    "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update \
    && apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io 

RUN whoami


RUN sudo usermod -aG docker root

RUN sudo systemctl enable docker.service

RUN npm install npm@latest -g
RUN npm install npm@latest -g

RUN npm --version

RUN npm install pm2 -g

RUN sudo apt-get update 
