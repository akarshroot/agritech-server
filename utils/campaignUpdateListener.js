const { default: mongoose } = require("mongoose");
const ContributionTx = require("../models/ContributionTx");
const { info } = require('./logger')

const campaignListener = function (io) {
    const connection = mongoose.connection
    connection.once("open", () => {
        io.of("/socket/campaign").on("connection", async (socket) => {
            const uid = socket.handshake?.query?.uid
            const userContributions = await ContributionTx.find({ senderId: uid }) //[123, 456, receiverId: 789]
            info("New user connected " + socket.id + " | UID: " + uid);
            const campaignChangeStream = connection.collection("contributiontxes").watch([], { fullDocument: "updateLookup" });
            campaignChangeStream.on("change", (change) => {                    //receiverId: 123                     //receiverId: 123
                const isContributor = userContributions.find(contributions => { return (contributions.receiverId.equals(change.fullDocument.receiverId)) })
                if (change.fullDocument && isContributor) {
                    switch (change.operationType) {
                        case "insert":
                            socket.emit("contributorAdded", change.fullDocument);
                            break;
                    }
                }
            });
            socket.on("disconnect", () => {
                console.log("socket.io: User disconnected: ", socket.id);
            });
        })
    });
}

module.exports = campaignListener