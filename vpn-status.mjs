import telnet from "telnet-client";
import localEmitter from "./event-emitter.mjs";

const connection = new telnet();

const params = {
    host: "localhost",
    port: 7505,
    timeout: 1500,
    negotiationMandatory: false,
    ors: "\r\n",
    waitfor: "\n"
};

connection.on("data", data => {
    const dataString = data.toString("utf8");
    if (dataString.includes(">CLIENT:ESTABLISHED")) {
        localEmitter.emit("clientConnectionEstablished");
    }
});

connection.on("error", () => {
    localEmitter.emit("telnetError");
});

function getVPNStatus(callback) {
    connection.send("status 1\n", (err, res) => {
        if (err) {
            localEmitter.emit("telnetError");
        }
        callback(err, parseVPNStatus(res));
    });
}

function parseVPNStatus(vpnStatus) {
    if (vpnStatus == undefined) {
        return null;
    }

    const vpnStatusParsed = vpnStatus.split("\n");

    if (!vpnStatusParsed[0].includes("OpenVPN CLIENT LIST")) {
        return null;
    }

    const headerData = vpnStatusParsed[2];
    const headerDataParsed = headerData.split(",");

    const clientList = [];
    let index = 3;

    while (
        !vpnStatusParsed[index].includes("ROUTING TABLE") &&
        index <= vpnStatusParsed.length
    ) {
        clientList.push(vpnStatusParsed[index++].split(","));
    }

    return {
        header: headerDataParsed,
        clients: clientList
    };
}

connection.connect(params);

export default { getVPNStatus };
