## Installation

- Head to [k6 Installation](https://k6.io/docs/getting-started/installation/) for your k6 installation

- Use npm to install the dependencies (if any)

```cmd
	npm install
```

## Basic Usage

#### Run test locally

- To run any test file (.js), simply use:

```cmd
	k6 run <path to test file>
	Ex: k6 run --env ENVIRONMENT=qa ./tests/apiSample.js
```

- To run with parameters in command line:
set "user=admin" && set "password=123" && k6 run ./tests/apiSample.js