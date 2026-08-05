const axios = require("axios");

class CWMS {

    constructor(office = "LRH") {

        this.office = office;

        this.baseUrl =
            "https://cwms-data.usace.army.mil/cwms-data";

        this.series = {

            elevation:
                "AlumCr-Lake.Elev.Inst.15Minutes.0.OBS",

            outflow:
                "AlumCr-Outflow.Flow.Inst.15Minutes.0.OBS",

            storage:
                "AlumCr-Lake.Stor.Inst.15Minutes.0.OBS",

            temperature:
                "AlumCr-Outflow.Temp-Water.Inst.1Hour.0.OBS"

        };

    }


    async getTimeseries(tsid) {

        const response = await axios.get(
            `${this.baseUrl}/timeseries`,
            {
                params: {
                    name: tsid,
                    office: this.office,
                    units: "SI",
                    begin: "PT6H"
                },

                headers: {
                    "accept":
                    "application/json;version=2"
                }
            }
        );

        return response.data;

    }


    latestValue(data) {

        if (!data.values || data.values.length === 0) {
            return null;
        }

        const values = data.values;

        const latest =
            values[values.length - 1];

        return {
            time: latest.dateTime || latest[0],
            value: latest.value || latest[1]
        };

    }


    metersToFeet(value) {

        return Number(
            (value * 3.28084).toFixed(2)
        );

    }


    cmsToCfs(value) {

        return Number(
            (value * 35.3147).toFixed(0)
        );

    }


    cubicMetersToAcreFeet(value) {

        return Number(
            (value * 0.000810714).toFixed(0)
        );

    }


    celsiusToFahrenheit(value) {

        return Number(
            ((value * 9 / 5) + 32).toFixed(1)
        );

    }


    async getLatest() {

        const [
            elevation,
            outflow,
            storage,
            temperature

        ] = await Promise.all([

            this.getTimeseries(this.series.elevation),

            this.getTimeseries(this.series.outflow),

            this.getTimeseries(this.series.storage),

            this.getTimeseries(this.series.temperature)

        ]);


        const elev =
            this.latestValue(elevation);

        const flow =
            this.latestValue(outflow);

        const stor =
            this.latestValue(storage);

        const temp =
            this.latestValue(temperature);


        return {

            elevation:
                elev
                    ? this.metersToFeet(elev.value)
                    : null,


            outflow:
                flow
                    ? this.cmsToCfs(flow.value)
                    : null,


            storage:
                stor
                    ? this.cubicMetersToAcreFeet(stor.value)
                    : null,


            temperature:
                temp
                    ? this.celsiusToFahrenheit(temp.value)
                    : null,


            updated:
                elev ? new Date(elev.time).toLocaleString() : null

        };

    }

}


module.exports = CWMS;const axios = require("axios");

class CWMS {

    constructor(office) {

        this.office = office;

        this.base =
            "https://cwms-data.usace.army.mil/cwms-data";

    }


    async getValues(tsid) {

        const response = await axios.get(
            `${this.base}/timeseries/${encodeURIComponent(tsid)}/values`,
            {
                params: {
                    office: this.office,
                    unit: "EN",
                    pageSize: 2
                }
            }
        );

        return response.data;

    }


    extractLatest(data) {

        if (!data.values || data.values.length === 0) {
            return null;
        }

        const latest =
            data.values[data.values.length - 1];

        return {
            time: latest[0],
            value: latest[1]
        };

    }


    metersToFeet(meters) {

        return +(meters * 3.28084).toFixed(2);

    }


    cmsToCfs(cms) {

        return +(cms * 35.3147).toFixed(0);

    }


    celsiusToFahrenheit(c) {

        return +((c * 9 / 5) + 32).toFixed(1);

    }


    async getLatest() {


        const series = {

            elevation:
            "AlumCr-Lake.Elev.Inst.15Minutes.0.OBS",

            inflow:
            "AlumCr-Lake.Flow.Inst.15Minutes.0.OBS",

            outflow:
            "AlumCr-Outflow.Flow.Inst.15Minutes.0.OBS",

            temperature:
            "AlumCr-Outflow.Temp-Water.Inst.1Hour.0.OBS"

        };


        const [
            elevation,
            inflow,
            outflow,
            temperature

        ] = await Promise.all([

            this.getValues(series.elevation),
            this.getValues(series.inflow),
            this.getValues(series.outflow),
            this.getValues(series.temperature)

        ]);


        const elev =
            this.extractLatest(elevation);

        const flowIn =
            this.extractLatest(inflow);

        const flowOut =
            this.extractLatest(outflow);

        const temp =
            this.extractLatest(temperature);



        return {

            elevation:
                this.metersToFeet(elev.value),

            inflow:
                this.cmsToCfs(flowIn.value),

            outflow:
                this.cmsToCfs(flowOut.value),

            temperature:
                this.celsiusToFahrenheit(temp.value),

            updated:
                elev.time

        };

    }

}


module.exports = CWMS;
