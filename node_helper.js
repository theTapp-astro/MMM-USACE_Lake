const NodeHelper = require("node_helper");
const CWMS = require("./lib/cwms");

module.exports = NodeHelper.create({

    start() {
        console.log("MMM-USACELake started");
    },

    socketNotificationReceived(notification, config) {

        if (notification !== "GET_DATA") {
            return;
        }

        const api = new CWMS(config.office);

        api.getLatest(config.location)
            .then(data => {

                this.sendSocketNotification(
                    "DATA",
                    data
                );

            })
            .catch(error => {

                console.error(error);

                this.sendSocketNotification(
                    "ERROR",
                    error.message
                );

            });

    }

});
