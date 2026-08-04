Module.register("MMM-USACELake", {

    defaults: {

        office: "LRH",
        location: "alumcr",

        updateInterval: 300000

    },

    start() {

        this.data = null;

        this.getData();

        setInterval(() => {

            this.getData();

        }, this.config.updateInterval);

    },

    getData() {

        this.sendSocketNotification(
            "GET_DATA",
            this.config
        );

    },

    socketNotificationReceived(notification, payload) {

        if (notification === "DATA") {

            this.data = payload;

            this.updateDom(500);

        }

    },

    getStyles() {

        return [
            "styles.css"
        ];

    },

    getDom() {

        const wrapper = document.createElement("div");

        wrapper.className = "usace";

        if (!this.data) {

            wrapper.innerHTML = "Loading lake data...";

            return wrapper;

        }

        wrapper.innerHTML = `
            <div class="title">${this.config.location.toUpperCase()}</div>

            <div class="row">
                <span>Elevation</span>
                <span>${this.data.elevation ?? "--"} ft</span>
            </div>

            <div class="row">
                <span>Inflow</span>
                <span>${this.data.inflow ?? "--"} cfs</span>
            </div>

            <div class="row">
                <span>Outflow</span>
                <span>${this.data.outflow ?? "--"} cfs</span>
            </div>

            <div class="row">
                <span>Water</span>
                <span>${this.data.temperature ?? "--"} °F</span>
            </div>

        `;

        return wrapper;

    }

});
