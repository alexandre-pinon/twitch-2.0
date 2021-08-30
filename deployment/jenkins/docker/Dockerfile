FROM jenkins/jenkins:lts

USER root

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

RUN sudo usermod -aG docker jenkins

RUN sudo systemctl enable docker.service