# OpenVPN-Activity-Monitor

Simple Node.js program to monitor the activity of OpenVPN clients and render a web interface to see a list of connected clients. Must run on the same machine which hosts the OpenVPN server.

![OpenVPN-Activity-Monitor-Screenshot](https://user-images.githubusercontent.com/17698478/75825650-11095500-5da6-11ea-9a78-b6e3db7e8b94.PNG)

<a name="installation"></a>

## Installation and Setup

### 1. Enable OpenVPN Management Interface

To use this program, the management interface of OpenVPN must be enabled in the `server.conf` file. On my system (Debian 10) this was located in `/etc/openvpn/`, but this may differ on other operating systems.

Append the following to the `server.conf` file:

```
# Make sure the path to server.conf is correct
echo 'management 127.0.0.1 7505' | sudo tee /etc/openvpn/server.conf -a
```

Then restart the OpenVPN service:

```
sudo systemctl stop openvpn@server
sudo systemctl enable openvpn@server.service
sudo systemctl start openvpn@server

```

You can check that the management interface is working by running

```
telnet localhost 7505
```

and you should see something like this:

```
Trying ::1...
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
>INFO:OpenVPN Management Interface Version 1 -- type 'help' for more info

```

You can type `help` to get a list of commands. To quit, type `exit`.

### 2. Setup Web Interface

Download the latest version of Node.JS (here using _nvm_):

```
sudo apt-get update
sudo apt-get install git curl npm -y
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

Close and re-open the terminal and type

```
nvm install node --lts
```

Make sure the latest version of Node.JS was installed by running

```
node --version
# Should be at least v13
```

Clone this repository:

```
cd ~/
git clone https://github.com/ErikLysne/OpenVPN-Activity-Monitor.git
cd OpenVPN-Activity-Monitor
npm i
```

Run the program:

```
node app.mjs
```

Open a web browser and go to `http://<host ip address>:3000` to launch the web interface.
