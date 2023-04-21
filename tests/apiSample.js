import http from 'k6/http';
import { baseURL, vuoptions,headers} from "../src/config/config.js";
import { verify } from '../src/utils/verify.js';
import { reports } from '../src/utils/html-reporter.js';

let userName = `${__ENV.user}`;
let password = `${__ENV.password}`;

export let options = vuoptions;

export default function () {
    const payload = JSON.stringify({
        "name": userName,
        "surname": password,
    });

    const res = http.post(baseURL+'/post', payload, {
        headers,
    });

    verify(res);

    if (res.status === 200) {
        // enters only successful responses otherwise, it triggers an exception
    const delPayload = JSON.stringify({ "name": res.json().json.name });
    http.patch(baseURL+'/patch', delPayload, { headers });
    }
}

export function handleSummary(data) {
    return reports(data);
}