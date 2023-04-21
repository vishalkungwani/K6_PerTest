import http from 'k6/http';
import { vuoptions,headers, baseURL2} from "../src/config/config.js";
import { verify } from '../src/utils/verify.js';
import { reports } from '../src/utils/html-reporter.js';

let userName = `${__ENV.user}`;
let password = `${__ENV.password}`;
let clientID = `${__ENV.clientID}`;
let clientSecret = `${__ENV.clientSecret}`;


export let options = vuoptions;

export default function () {
    const formdata = {
        "client_id": clientID,
        "client_secret": clientSecret,
        "name": userName,
        "surname": password,
        "grant_type":"password"
    };

    const res = http.post(baseURL2+'/realms/dev-env/protocol/openid-connect/token', formdata, {
        headers,
    });
    verify(res);

}

export function handleSummary(data) {
    return reports(data);
}