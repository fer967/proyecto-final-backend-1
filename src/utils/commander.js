const {Command} = require("commander");
const program = new Command();

program
    .option("-p <port>", "puerto donde se inicia servidor", 8080)
    .option("--mode <mode>", "modo de trabajo", "development")
program.parse();

module.exports = program;
