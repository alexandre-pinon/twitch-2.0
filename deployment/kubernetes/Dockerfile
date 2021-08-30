FROM debian:buster-slim

LABEL maintainer="Sutoremondesu"
LABEL description="Docker image use for pipeline"

ENV DEBIAN_FRONTEND=noninteractive


SHELL ["/bin/bash", "-c"]


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

RUN sudo usermod -aG docker root

RUN sudo systemctl enable docker.service

RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(  -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN  chmod +x ./kubectl
RUN  sudo mv ./kubectl /usr/local/bin/kubectl
RUN  kubectl version --client

RUN curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
RUN sudo install minikube-linux-amd64 /usr/local/bin/minikube
RUN sudo apt-get install -y conntrack
RUN minikube start --driver=none