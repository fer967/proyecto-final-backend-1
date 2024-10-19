const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const {mode} = program.opts();
dotenv.config({
    path: mode === "development"?"./.env.development":"./.env.production"
});

let configObject = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    secret: process.env.SECRET,
    tokenSecret: process.env.TOKEN
}

module.exports = configObject;
