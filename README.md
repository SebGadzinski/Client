[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=3619b84d2ed0&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

# Gadzy Work Client

Client for Gadzy Work. This application hooks up to the /Server Repo.

## SETTING UP WITH /Server

If you are setting this front end with my /Server repo, please complete the /Server repo first as the client needs to connect to the server.

## Uses

-   Freelancing Management Application
-   Outsourcing Management Application
-   Work Management Application

## Before Running

1. Navigate to a folder that you would like the server inside. (Typically the folder you have your /Server in)
2. [git clone](https://github.com/SebGadzinski/Client.git)
3. cd Client
4. Make a .env file (This is just needed for the client to run nothing inside)
5. npm install

## config.js file

6. Edit the sample-config.js file and rename it to config.js.
    - The cert and key for https usage is generate from the server if the HTTPS config bool is turned on.
    - CTRL F 'SERVER_DOMAIN' in the config.js file and edit the Port Number from 5000 to whatever you gave

## Run the client

7. npm run dev

## Publishing

### Web

1. npm run build-www
    - This create static files in /src-capacitor/www
    - These files can be hosted on a web server

### Android

WIP

### ios

WIP
