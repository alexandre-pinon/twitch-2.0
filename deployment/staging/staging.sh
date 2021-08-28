#!/bin/bash

set -euxo pipefail

step=1
step() {
    echo "Step $step $1"
    step=$((step+1))
}

install_docker() {
    step "===== Installing docker ====="
    sudo apt-get update
    sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common gnupg lsb-release
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    if [ $? -ne 0 ]; then
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    fi
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    # sudo groupadd docker
    sudo gpasswd -a $USER docker
    sudo chmod 777 /var/run/docker.sock
    # Add vagrant to docker group
    # sudo groupadd docker
    sudo gpasswd -a vagrant docker
    # Setup docker daemon host
    # Read more about docker daemon https://docs.docker.com/engine/reference/commandline/dockerd/
    # sed -i 's/ExecStart=.*/ExecStart=\/usr\/bin\/dockerd -H unix:\/\/\/var\/run\/docker.sock -H tcp:\/\/192.168.121.210/g' /lib/systemd/system/docker.service
    # sudo systemctl daemon-reload
    # sudo systemctl restart docker
}

install_openssh() {
    step "===== Installing openssh ====="
    sudo apt-get update
    sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    sudo apt-get install -y openssh-server
    sudo systemctl enable ssh
    sleep 5
}

install_tools() {
    sudo apt-get install -y python3-pip
}

install_java() {
    step "===== Installing java ====="
    sudo apt-get install -y openjdk-8-jdk
    java -version
}

install_jenkins() {
    step "===== Installing jenkins ====="
    wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
    sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
    sudo apt-get update && sudo apt-get upgrade -y
    sudo apt-get install -y jenkins
    sudo usermod -aG docker jenkins 
}

setup_root_login() {
    sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
    # sudo systemctl restart sshd.service
}

setup_welcome_msg() {
    sudo apt-get -y install cowsay
    sudo echo -e "\necho \"Welcome to Willy Ubuntu Server 20.04\" | cowsay\n" >> /home/vagrant/.bashrc
    sudo ln -s /usr/games/cowsay /usr/local/bin/cowsay
}

main() {
    install_docker
    install_openssh
    install_tools
    install_java
    install_jenkins
    setup_root_login
    setup_welcome_msg
}

main