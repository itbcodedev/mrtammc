// load file from ./configfiles
const { loadGTFSDataFromFile } = require("./routes/gtfs-helper");

function loadConfigfile(file) {
  const url = "./configfiles/" + file;
  return loadGTFSDataFromFile(url);
}

module.exports = loadConfigfile;
