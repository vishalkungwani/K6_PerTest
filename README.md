<h3 align="center" style="bold">An automation testing framework for performance test based on <a href="https://k6.io/">k6</a>. With <a href="https://www.influxdata.com/">InfluxDB</a>, <a href="https://grafana.com/">Grafana Dashboard</a> 

## Installation

- Head to [k6 Installation](https://k6.io/docs/getting-started/installation/) for your k6 installation

- Use npm to install the dependencies (if any)

```bash
	npm install
```

## Basic Usage

#### Run test locally

- To run any test file (.js), simply use:

```bash
	k6 run <path to test file>
```

#### Run test with options

- Specify VUs (virtual users) as 10, duration 30s, passed as parameters

```bash
	k6 run --vus 10 --duration 30s script.js
```

- Set up standard outpput for result 

```bash
	k6 run --out json=full.json --summary-export=summary.json script.js
```

- For more info: [Running k6](https://k6.io/docs/getting-started/running-k6/)

## Write Test

### Four stages of test life cyle

- To begin, you need to know the four distinct life cycle stages in a k6 test are "init", "setup", "VU" and "teardown"

```bash
	// 1. init code

	export function setup() {
	  // 2. setup code
	}

	export default function (data) {
	  // 3. VU code
	}

	export function teardown(data) {
	  // 4. teardown code
	}
```

:one: Init code - VU level: outside of default function() and only run once per VU

:two: VU code - VU level: inside of default function() and is run over and over for as long as the test is running. A VU will execute the default function from start to end in sequence, once the VU reaches the end of the default function it will loop back to the start and execute the code all over.

:three: Setup code - Test-wide level: The setup is only called once for a test. Setup is called at the beginning of the test, after the init stage but before the VU stage (default function

:four: Teardown code - Test-wide level: The teardown are only called once for a test. Teardown is called at the end of a test, after the VU stage (default function).

- For more info: [k6 Test Life Cycle](https://k6.io/docs/using-k6/test-life-cycle/)

- Run the test which already has handleSummary function specified, take a look at [animal-soak-test.js]

```bash
	k6 run ./tests/atwt/animal-soak-test.js
```

- Run js file html-report.js to generate html report from json report

```bash
	node ./src/utils/html-reporter.js
```

- The exported report "report.html" will be located at "path-to-output-directory"
- For more info: [k6-html-reporter](https://www.npmjs.com/package/k6-html-reporter)

## InfluxDB And Grafana Dashboard

### Definition

- Adding InfluxDB and Grafana, K6 gives a very powerful visualisation of the load test as it runs
- [InfluxDB](https://github.com/influxdata/influxdb): is a fast time-series database, which is supported by K6 as an output target for realtime monitoring of a test. Whilst K6 is running, it will stream run statistics to InfluxDB
- [Grafana](https://github.com/grafana/grafana): is a beautiful browser UI for data visualisation, which supports InfluxDB as a data source