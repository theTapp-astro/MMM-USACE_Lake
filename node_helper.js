const NodeHelper = require("node_helper");
const CWMS = require("./lib/cwms");

module.exports = NodeHelper.create({

    start() {
        console.log("MMM-USACE_Lake: node_helper started");

        this.cwms = null;
    },

    socketNotificationReceived(notification, payload) {

        if (notification !== "USACE_GET_DATA") {
            return;
        }

        if (!this.cwms) {
            this.cwms = new CWMS(payload.office);
        }

        this.getLakeData(payload);

    },

    async getLakeData(config) {

        try {

            const data = await this.cwms.getLatest(
                config.location,
                config.units
            );

            this.sendSocketNotification(
                "USACE_DATA",
                data
            );

        } catch (error) {

            console.error(
                "MMM-USACE_Lake:",
                error.message
            );

            this.sendSocketNotification(
                "USACE_ERROR",
                error.message
            );

        }

    }

});
