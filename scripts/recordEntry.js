var fs = require("fs");
const path = require('path');
const csv = require('@fast-csv/parse');
const {parse} = require('json2csv');

var opts = {
    headers:true ,
    includeEndRowDelimiter:true
}
var entry = (data) => {
    csv.format();
    
    csv.write(data, opts)
    .pipe(fs.createWriteStream("records.csv",{flags:"a"}));
    console.log("new record added")
    opts.headers = false;
}

module.exports.entry = entry;