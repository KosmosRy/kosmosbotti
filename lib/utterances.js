const fs = require("fs");

function* init (source) {
    if (!Array.isArray(source) || !source.length) {
        throw new Error("No array or empty array provided");
    }

    while (true) {
        yield source[Math.floor(Math.random() * source.length)];
    }
}

init.fromFile = file => init(JSON.parse(fs.readFileSync(file, "utf8")));

module.exports = init;