import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { jUnit, textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function reports(data) {
    return {
        "./results/html-result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
        './results/junit-result.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
        './results/json-result.json': JSON.stringify(data), // and a JSON with all the details...
    };
}