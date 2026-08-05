const NodeHelper = require("node_helper");
const CWMS = require("./lib/cwms");

module.exports = NodeHelper.create({

    start() {
        console.log("MMM-USACE_Lake started");
    },

    socketNotificationReceived(notification, config) {

        if (notification !== "GET_DATA") {
            return;
        }

        const api = new CWMS(config.office);

        api.getLatest()
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
