import { group, check, fail } from "k6";
import http from "k6/http";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

import { setSleep } from "../utils/sleep.utils.js";

function launchAppVerify(BASE_URL){
    group("launchAppVerify", function () {
        let res = null;
        // As mentioned above, this logic just forces the performance alert for too many urls, use env URL_ALERT to force it
        // It also highlights the ability to programmatically do things right in your script
    
            res = http.get(BASE_URL+"/?ts=" + Math.round(randomIntBetween(1, 2000)));
        let checkRes = check(res, {
            "Homepage welcome header present": (r) => r.body.indexOf("Welcome to the k6.io demo site!") !== -1
        });

        // Record check failures
        checkFailureRate.add(!checkRes);

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        // Load static assets
        group("Static assets", function () {
            let res = http.batch([
                ["GET", BASE_URL+"/static/css/site.css", {}, { tags: { staticAsset: "yes" } }],
                ["GET", BASE_URL+"o/static/js/prisms.js", {}, { tags: { staticAsset: "yes" } }]
            ]);
            checkRes = check(res[0], {
                "Is stylesheet 4859 bytes?": (r) => r.body.length === 4859,
            });

            // Record check failures
            checkFailureRate.add(!checkRes);

            // Record time to first byte and tag it with the URL to be able to filter the results in Insights
            timeToFirstByte.add(res[0].timings.waiting, { ttfbURL: res[0].url, staticAsset: "yes" });
            timeToFirstByte.add(res[1].timings.waiting, { ttfbURL: res[1].url, staticAsset: "yes" });
        });

    });
}
function login(loginData,BASE_URL) {
    group("Login", function () {
        let res = http.get(BASE_URL+"/my_messages.php");
        let checkRes = check(res, {
            "Users should not be auth'd. Is unauthorized header present?": (r) => r.body.indexOf("Unauthorized") !== -1
        });

        //extracting the CSRF token from the response

        const vars = {};

        vars["csrftoken"] = res
            .html()
            .find("input[name=csrftoken]")
            .first()
            .attr("value");

        // Record check failures
        checkFailureRate.add(!checkRes);

        let position = Math.floor(Math.random() * loginData.users.length);
        let credentials = loginData.users[position];

        res = http.post(BASE_URL+"/login.php", { login: credentials.username, password: credentials.password, redir: '1', csrftoken: `${vars["csrftoken"]}` });
        checkRes = check(res, {
            "is logged in welcome header present": (r) => r.body.indexOf("Welcome, "+credentials.username+"!") !== -1
        });

        // Record successful logins
        if (checkRes) {
            successfulLogins.add(1);
        }

        // Record check failures
        checkFailureRate.add(!checkRes, { page: "login" });

        // Record time to first byte and tag it with the URL to be able to filter the results in Insights
        timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

        setSleep(8, 10);
    });
}


module.exports = {launchAppVerify,login}