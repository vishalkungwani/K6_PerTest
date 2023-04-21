export const baseURL = "https://httpbin.test.k6.io";

export const baseURL2 = "https://gateway.test.ma.halo-telekom.com";


// options.stages to configure ramp up/down VU level
export const vuoptions = {
    stages: [
        { target: 20, duration: "20s" },
        { target: 20, duration: "20s" },
        { target: 0, duration: "10s" }
    ]
}

export const headers = { 'Content-Type': 'application/json' };
