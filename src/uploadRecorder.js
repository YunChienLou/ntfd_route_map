function writeRecord() {
  var fs = require("fs");
  var origin = require("./data/data.json");
  var updateRecord = {
    lastTime: new Date().toISOString(),
    dataAmount: origin.length,
  };
  fs.readFile("./data/updateHistory.json", function (err, data) {
    var json = JSON.parse(data);
    json.push(updateRecord);
    if (err) {
      console.log(err);
    }
    fs.writeFile(
      "./data/updateHistory.json",
      JSON.stringify(json),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
  });
}
writeRecord();
