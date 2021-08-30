FROM debian:buster-slim

LABEL maintainer="Sutoremondesu"
LABEL description="Docker image use for pipeline"

ENV DEBIAN_FRONTEND=noninteractive


SHELL ["/bin/bash", "-c"]

# Set timezone to Paris by default
RUN ln -sf /usr/share/zoneinfo/Europe/Paris /etc/localtime
# Use unicode
RUN locale-gen C.UTF-8 || true
ENV LANG=C.UTF-8

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
        openssh-client \
        mlocate 

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

RUN mkdir ~/.docker

RUN chmod -R 777 ~/.docker

RUN ls -hla ~/.

RUN ls -hla ~/.docker

# Install kubectl
# RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
# RUN chmod +x ./kubectl
# RUN sudo mv ./kubectl /usr/local/bin/kubectl
# RUN kubectl version --client

# Install Gcloud 
# Downloading gcloud package
RUN curl https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz > /tmp/google-cloud-sdk.tar.gz

# Installing the package
RUN mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh

# Adding the package path to local
ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

RUN sudo apt-get install -y \
     python3-distutils \
     python3-venv

RUN sudo apt-get update 