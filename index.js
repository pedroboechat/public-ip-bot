// Configure .env
require("dotenv").config();

// Require libraries
const fs = require("fs");

// Parse config file
const config = JSON.parse(fs.readFileSync("./config.json"));

// Call main function
const main = require("./src/main").default;
main(config);