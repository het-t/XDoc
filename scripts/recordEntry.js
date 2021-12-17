var fs = require("fs");
const fastcsv = require("fast-csv")
const { format } = require('@fast-csv/format');
const { writeToPath  } = require('@fast-csv/format');
const path = require('path');

const record = require('../routes/users').record;

const wStream = fs.createWriteStream("../records.csv", {flags:"a"});
const stream = format();
stream.pipe(wStream);


var entry = (data) => {
    writeToPath(path.resolve(__dirname, '../records.csv'), data)
    .on('error', err => console.error(err))
    .on('finish', () => console.log('Done writing.'));
}

module.exports.entry = entry;