# End-Year-Project
## About The Project
In this unit we have develop a complete E-commerce website using Symfony, a PHP framework well used in the industry.
To exchange data between the back-end and the front-end we have implement a REST API.

<br/>
<p align="center">
<!-- PROJECT LOGO -->
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Epitech.png/1598px-Epitech.png" width="250">
<br/><br/>
T-WEB-600-PAR-6-1-ecommerce-alexandre.pinon
</p>
<br/>

## App Built With
### Front-End
* [ReatJS](https://fr.reactjs.org/) >= 17.0.2
### Back-End
* [Php](https://www.php.net/) >= 8.0
* [Composer](https://getcomposer.org/) >= 2.0.12
* [Symfony](https://symfony.com/) >= 4.23.5
* [Mysql](https://www.mysql.com/) >= 8.0 
### Deployment
* [Ansible](https://www.ansible.com/) >= 2.9.6
* [Ansistrano](https://ansistrano.com/)
* [Vagrant](https://www.vagrantup.com/) >= 2.2.15
* [VirtualBox](https://www.virtualbox.org/) >= 6.1


## Skills to acquire
- REST API development
- PHP Framework: Symfony
- Web development
- Group organisation
- Documentation

<!-- API DOCUMENTATION -->
## API Documentation 
### User
- [Login](doc/Login.md)
- [Register](doc/Register.md)
- [Logout](doc/Logout.md)
- [Info](doc/Info.md)
- [Edit](doc/Update_Info.md)
- [Refresh token](doc/Refresh_Token.md)
### Product
- [Get all](doc/Get_All_products.md)
- [Get single](doc/Get_Single_product.md)
- [Add](doc/Add.md)
- [Edit](doc/Edit.md)
- [Delete](doc/Delete.md)
### Cart
- [Get products](doc/Get_Cart_Products.md)
- [Add product to cart](doc/Add_Product_to_Cart.md)
- [Remove product from cart](doc/Remove_Product_From_Cart.md)
- [Validate](doc/Validate.md)
### Order
- [Get all](doc/Get_All_orders.md)
- [Get single](doc/Get_Single_order.md)

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is what you need to use the software and how to install them.
* **ssh**
  ```sh
  sudo apt update
  sudo apt install openssh-server
  ```
    * If this is your first time with ssh, you have to generate a new key named ***id_rsa*** [here](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

* **ansible >= 2.9.6**
  ```sh
  sudo apt install ansible
  ```
* **vagrant >= 2.2.15**
  ```sh
  curl -fsSL https://apt.releases.hashicorp.com/gpg |sudo apt-key add -
  sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
  sudo apt-get update && sudo apt-get install vagrant
  ```
* **ansistrano >= 2.9.6**
  ```sh
  ansible-galaxy install ansistrano.deploy ansistrano.rollback
  ```
    * Then copy the following code in the begining of ***~/.ansible/roles/ansistrano.deploy/tasks/update-code/git.yml***
        ```yml
        - name: ANSISTRANO | GIT | Pull origin master
          command: git pull origin master
          delegate_to: 127.0.0.1

        - name: ANSISTRANO | GIT | ADD
          command: git add -A
          delegate_to: 127.0.0.1

        - name: ANSISTRANO | GIT | Commit
          command: git commit --amend --no-edit
          delegate_to: 127.0.0.1

        - name: ANSISTRANO | GIT | Push
          command: git push coco master --force
          delegate_to: 127.0.0.1
        ```

### **Installation**

1. Clone & go to the repo folder
   ```sh
   git clone https://github.com/EpitechIT2020/T-WEB-600-PAR-6-1-ecommerce-alexandre.pinon.git
   cd T-WEB-600-PAR-6-1-ecommerce-alexandre.pinon
   ```
2. Execute ***./script.sh*** (if the file does not have right permission, do ***"chmod +x ./script.sh"***)
   ```sh
   ./script.sh
   ```
<!-- USAGE EXAMPLES -->
##  🚀 Usage

After deployment has performed, go to http://192.68.50.50:3000
## 🤝 Code Contributors 
This project exists thanks to all the people who contribute.

<br/>
<a href="https://github.com/Wbebey">
  <img src="https://github.com/Wbebey.png?size=100">
</a>
<a href="https://github.com/alexandre-pinon">
  <img src="https://github.com/alexandre-pinon.png?size=100">
</a>
<a href="https://github.com/Keisay">
  <img src="https://github.com/Keisay.png?size=100">
</a>
<br/>
<br/>


## 📝 License

This project is [MIT](LICENSE) licensed.



