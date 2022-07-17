import http from "k6/http";
import { check, sleep } from "k6";

// This will export to HTML as filename "result.html" AND also stdout using the text summary
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { jUnit, textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// options.stages to configure ramp up/down VU level
export let options = {
    stages: [
        // Ramp-up from 1 to 20 VUs in 20s
        { duration: "30s", target: 20 },
        // Ramp-down from 20 to 10 VUs in 1m
        { duration: "1m", target: 10 },
         // Ramp-down from 5 to 0 VUs for 20s
        { duration: "20s", target: 0 },
    ]
}

// this defines the entry point for your VUs
// similar to the main() function in many other language

export default function () {
    let res = http.get("http://test.loadimpact.com");

    // check() function to verify status code, transaction time etc
    check(res, {
        "status was 200": (r) => r.status == 200,
        "transaction time OK": (r) => r.timings.duration < 200
    });
    sleep(1);
}

export function handleSummary(data) {
    return {
        "./results/html-result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
        './results/junit-result.xml': jUnit(data), // but also transform it and save it as a JUnit XML...
        './results/json-result.json': JSON.stringify(data), // and a JSON with all the details...
        // And any other JS transformation of the data you can think of,
        // you can write your own JS helpers to transform the summary data however you like!
    };
}