# OpenVPN-Activity-Monitor

Simple Node.js program to monitor the activity of OpenVPN clients and render a web interface to see a list of connected clients. Must run on the same machine which hosts the OpenVPN server.

![OpenVPN-Activity-Monitor-Screenshot_2](https://user-images.githubusercontent.com/17698478/75901878-7a897200-5e3f-11ea-876c-5eb4a5c8ed0a.PNG)

<a name="installation"></a>

## Installation and Setup

### 1. Enable OpenVPN Management Interface

To use this program, the OpenVPN Management Interface must be enabled in the `server.conf` file. On my system (Debian 10) this was located in `/etc/openvpn/`, but this may differ on other operating systems.

Append `management 127.0.0.1 7505` to the `server.conf` file, e.g. by running:

```
# Make sure the path to server.conf is correct
echo 'management 127.0.0.1 7505' | sudo tee /etc/openvpn/server.conf -a
```

Then restart the OpenVPN service:

```
sudo systemctl restart openvpn@server.service

```

You can check that the management interface is working by running:

```
telnet localhost 7505
```

The output should look something like this:

```
Trying ::1...
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
>INFO:OpenVPN Management Interface Version 1 -- type 'help' for more info

```

For a list of available commands, type `help`. To quit, type `exit`.

### 2. Setup Web Interface

**Note:** The Node.JS program is basically just parsing the responses from the OpenVPN Management Interface. It is therefore important that the OpenVPN Management Interface was enabled correctly in the previous step.

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
node --experimental-modules app.mjs
```

Open a web browser and go to `http://<host ip address>:3000` to launch the web interface.
