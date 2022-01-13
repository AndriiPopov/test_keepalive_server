const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");

const responseIds = {};
let currentId = 0;

const pollResource = async (req, res) => {
    try {
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Connection", "keep-alive");
        // res.setHeader('transfer-encoding', 'chunked')
        res.setHeader("X-Accel-Buffering", "no");

        res.flushHeaders(); // flush the headers to establish SSE with client

        const { timeOnClient } = req.body;
        console.log("timeOnClient", timeOnClient);
        // Give each response an id and add it to object of reponses with ids it is polling
        currentId += 1;
        const resId = `r_${currentId}`;
        responseIds[resId] = { res, ids: [] };

        // On close delete response from responseIds and remove the response id from object of subscribed resources
        req.on("close", () => {
            if (responseIds[resId]) {
                delete responseIds[resId];
            }
        });

        // Handle locales

        setTimeout(() => {
            req.pause();
            res.status = 400;
            res.end("restart poll");
        }, 30 * 60 * 1000);
    } catch (error) {
        if (!error.isOperational) {
            throw new ApiError(httpStatus.CONFLICT, "Not created");
        } else throw error;
    }
};

setInterval(async () => {
    Object.keys(responseIds).forEach((resId) => {
        const res = responseIds[resId];
        if (res && res.res) {
            console.log("sending ping");
            res.res.write(
                `data: ${JSON.stringify({
                    messageCode: "ping",
                    time: Date().toString(),
                })}\n\n`
            );
            res.res.flush();
        }
    });
}, 15000);

module.exports = {
    pollResource,
};
