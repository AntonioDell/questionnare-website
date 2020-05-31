# questionnare-website
Simple NodeJS Applikation for a specific questionnaire problem

# How to run on amazon ec2 instance
1. Launch amazon ec2 (refer to official docs for this)
    - Be sure to allow access to port 80 in the security groups
2. Log into the server by ssh (Putty)
3. Install node.js (with nvm)
4. Install pm2 (with npm)
5. Install git and clone this repo onto the server
    - It may be necessary to run `npm install` inside the repo directory
6. Choose a higher port to run your server on (fe. 8080). Replace `<SERVER_PORT>` in the following steps with your chosen port.
7. Redirect traffic from port 80 to the port specified when running the server.mjs by using `sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port <SERVER_PORT>`
8. Run server.mjs with pm2 by using `PORT=<SERVER_PORT> pm2 start server.mjs`
9. Open the public dns ip4 adress of your amazon ec2 instance in a web browser. The application should be visible.