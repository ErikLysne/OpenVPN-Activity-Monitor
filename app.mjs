import express from "express";
import http from "http";
import path from "path";
import url from "url";
import socket from "socket.io";
import localEmitter from "./event-emitter.mjs";
import vpnStatus from "./vpn-status.mjs";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

const graphData = {
    timestamp: [],
    received: [],
    sent: []
};

const graphDataBufferLength = 20;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/clients", (req, res) => {
    res.render("clients", { active: "clients" });
});

app.get("/data", (req, res) => {
    res.render("data", { active: "data" });
});

app.get("/", (req, res) => {
    res.redirect("clients");
});

// Fallback route
app.use((req, res) => {
    res.status(404).render("404");
});

server.listen(3000, console.log("listening on port 3000"));

// Refresh vpn status when new user loads page
io.on("connection", socket => {
    console.log("New user instance.");
    updateVPNStatus();
});

// Refresh vpn status when new client connects
localEmitter.on("clientConnectionEstablished", () => {
    console.log("New client connected.");
    updateVPNStatus();
    io.emit("clientConnectionEstablished");
});

// Refresh vpn status periodically
setInterval(function() {
    updateVPNStatus(status => {
        graphData.timestamp.push(new Date().toLocaleTimeString());
        graphData.received.push(
            status.clients.reduce(
                (totalDataReceived, client) =>
                    totalDataReceived + parseInt(client[2]),
                0
            )
        );
        graphData.sent.push(
            status.clients.reduce(
                (totalDataSent, clientData) =>
                    totalDataSent + parseInt(clientData[3]),
                0
            )
        );

        if (graphData.timestamp.length > graphDataBufferLength) {
            graphData.timestamp.shift();
            graphData.sent.shift();
            graphData.received.shift();
        }

        io.emit("graphDataUpdate", graphData);
    });
}, 2000);

function updateVPNStatus(callback) {
    vpnStatus.getVPNStatus((err, status) => {
        if (status !== null) {
            console.log("Active clients:\n");
            console.log(status.clients);

            io.emit("vpnStatusUpdate", status);
            typeof callback === "function" && callback(status);
        }
    });
}

localEmitter.on("telnetError", () => {
    io.emit("telnetError");
});
