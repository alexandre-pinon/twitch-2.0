Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/focal64"
    config.vm.network "private_network", ip: "192.168.50.50"
    config.vm.provision:shell, path: "deployment/staging/staging.sh"
    config.vm.provision "shell" do |s|
      ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
      s.inline = <<-SHELL
        # sudo apt-get install openssh-server
        echo "PermitRootLogin" >> /etc/ssh/sshd_config
        echo "PubkeyAuthentication" >> /etc/ssh/sshd_config
        # mkdir -p /home/vagrant/.ssh/
        mkdir -p /root/.ssh/
        # chmod 700 /home/vagrant/.ssh
        # touch /home/vagrant/.ssh/authorized_keys
        touch /root/.ssh/authorized_keys
        # chmod -R 600 /home/vagrant/.ssh/authorized_keys
        echo #{ssh_pub_key} >> /home/vagrant/.ssh/authorized_keys
        echo #{ssh_pub_key} >> /root/.ssh/authorized_keys
        # chown -R vagrant:vagrant /home/vagrant
        sudo apt-get install -y python-is-python3
      SHELL
    end
    config.vm.provider "virtualbox" do |v|
      v.memory = 4096
      v.cpus = 2
    end
  end
  