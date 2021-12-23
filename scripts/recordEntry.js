var fs = require("fs");
const path = require('path');
const csv = require('@fast-csv/format');
// const {parse} = require('json2csv');
// const fields = ["changed", "disease", "age", "visit", "cure", "lvisit", "nvisit"];
// const eol = "\n";|| ["patientName", "disease", "age", "visit", "cure", "lvisit", "nvisit"],
var opts = {
    headers:true ,
    includeEndRowDelimiter:true
}
var entry = (data) => {
    csv.format();
    csv.write(data, opts)
    .pipe(fs.createWriteStream("records.csv",{flags:"a"}));
    console.log("done")
    opts.headers = false;
}
// var entry = (data) => {
//     try {
//         const flExist = fs.existsSync("records.csv")
//         if (flExist) {
//             const csv = parse(data);
//             fs.appendFileSync('records.csv', csv)
//         } else {
//             const csv = parse(data, opts);
//             fs.appendFileSync('records.csv', csv)
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }

module.exports.entry = entry;