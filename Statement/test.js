const config = require("./config")
const print = require("./print")
const baseStatement = require("./baseStatement");

// print("test\n\n\n=", config.printer1)
print(baseStatement, config.printer1)
// print("test\n\n\n=", config.printer2)