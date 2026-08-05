/* global Module */

Module.register("MMM-USACE_Lake", {

    defaults: {
        office: "LRH",
        location: "AlumCr",
        title: "Alum Creek Lake",
        refreshInterval: 5 * 60 * 1000,
        animationSpeed: 1000,
        units: "EN",
        showTemperature: true,
        showStorage: true,
        showUpdated: true,
        debug: false
    },

    start() {
        Log.info(`Starting module: ${this.name}`);

        this.loaded = false;
        this.error = null;
        this.lakeData = {};

        this.getLakeData();

        this.timer = setInterval(() => {
            this.getLakeData();
        }, this.config.refreshInterval);
    },

    getStyles() {
        return [
            "styles.css"
        ];
    },

    getLakeData() {
        this.sendSocketNotification("USACE_GET_DATA", {
            office: this.config.office,
            location: this.config.location,
            units: this.config.units
        });
    },

    socketNotificationReceived(notification, payload) {

        if (notification === "USACE_DATA") {

            if (this.config.debug) {
                Log.info(payload);
            }

            this.loaded = true;
            this.error = null;
            this.lakeData = payload;

            this.updateDom(this.config.animationSpeed);
        }

        if (notification === "USACE_ERROR") {

            this.error = payload;
            this.loaded = true;

            this.updateDom();
        }
    },

    getDom() {

        const wrapper = document.createElement("div");
        wrapper.className = "usace-wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading USACE data...";
            return wrapper;
        }

        if (this.error) {
            wrapper.innerHTML = `Error: ${this.error}`;
            return wrapper;
        }

        const title = document.createElement("div");
        title.className = "usace-title";
        title.innerHTML = this.config.location;

        wrapper.appendChild(title);

        wrapper.appendChild(this.makeRow(
            "Elevation",
            `${this.lakeData.elevation ?? "--"} ft`
        ));

        wrapper.appendChild(this.makeRow(
            "Outflow",
            `${this.lakeData.outflow ?? "--"} cfs`
        ));

        if (this.config.showStorage) {

            wrapper.appendChild(this.makeRow(
                "Storage",
                `${this.lakeData.storage ?? "--"} ac-ft`
            ));

        }

        if (this.config.showTemperature) {

            wrapper.appendChild(this.makeRow(
                "Water Temp",
                `${this.lakeData.temperature ?? "--"} °F`
            ));

        }

        if (this.config.showUpdated) {

            wrapper.appendChild(this.makeRow(
                "Updated",
                this.lakeData.updated ?? "--"
            ));

        }

        return wrapper;
    },

    makeRow(label, value) {

        const row = document.createElement("div");
        row.className = "usace-row";

        const left = document.createElement("span");
        left.className = "label";
        left.innerHTML = label;

        const right = document.createElement("span");
        right.className = "value";
        right.innerHTML = value;

        row.appendChild(left);
        row.appendChild(right);

        return row;
    }

});
