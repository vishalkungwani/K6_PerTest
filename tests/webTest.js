import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import webActions from "../src/actions/k6-web.action.js"
const loginData = JSON.parse(open("../src/data/users.json"));  // download the data file here: https://test.k6.io/static/examples/users.json
const BASE_URL = "https://test.k6.io/";

/* Options
Global options for your script
stages - Ramping pattern
thresholds - pass/fail criteria for the test
ext - Options used by Load Impact cloud service test name and distribution
*/
export let options = {
    stages: [
        { target: 20, duration: ".25m" },
        { target: 20, duration: ".25m" },
        { target: 0, duration: ".25m" }
    ],
    thresholds: {
        "http_req_duration": ["p(95)<500"],
        "http_req_duration{staticAsset:yes}": ["p(95)<400"],
        "check_failure_rate": ["rate<0.3"]
    },
};

// Custom metrics
// We instantiate them before our main function
let successfulLogins = new Counter("successful_logins");
let checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);


/* Main function
The main function is what the virtual users will loop over during test execution.
*/
export default function () {
    // We define our first group.  Pages natually fit a concept of a group
    // You may have other similar actions you wish to "group" together
    group("launchAppVerify", function () {
        webActions.launchAppVerify(BASE_URL)
    });

    sleep(10);

    group('Login', () => {
        webActions.login(loginData,BASE_URL)
    })
}