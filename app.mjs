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

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
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
    updateVPNStatus();
}, 10000);

function updateVPNStatus() {
    vpnStatus.getVPNStatus((err, status) => {
        if (status !== null) {
            console.log("Active clients:\n");
            console.log(status.clients);
            io.emit("vpnStatusUpdate", status);
        } else {
            updateVPNStatus();
        }
    });
}
