const axios = require("axios");

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
