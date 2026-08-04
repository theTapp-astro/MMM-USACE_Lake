const axios = require("axios");

class CWMS {

    constructor(office) {
        this.office = office;
        this.baseURL = "https://cwms-data.usace.army.mil/cwms-data";
    }

    async getLatest(location) {

        // Placeholder implementation.
        // Step 2 will discover TSIDs automatically.

        return {
            elevation: null,
            inflow: null,
            outflow: null,
            temperature: null,
            updated: null
        };
    }

}

module.exports = CWMS;
