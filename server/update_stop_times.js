const numericFields = {
  stopSequence: 1,
  monday: 1,
  tuesday: 1,
  wednesday: 1,
  thursday: 1,
  friday: 1,
  saturday: 1,
  sunday: 1
};


function isNumeric(value) {
  return !isNaN(value);
}

const isNumericField = field => (numericFields[field] ? true : false);

function loadGTFSDataFromFile(filepath, agency_key) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    let fields = [];
    let data = [];

    const fileHandler = require('readline').createInterface({
      input: require('fs').createReadStream(filepath)
    });

    fileHandler.on('line', line => {
      const cells = line.split(',');
      // first line is field name
      if (lineCount === 0) {
        cells.forEach(c => fields.push(c));
      } else {
        let resource = {};
        resource['agency_key'] = agency_key
        for (let i = 0; i < fields.length; i++) {
          const name = fields[i];
          resource[name] = isNumericField(name) ?
            Number.parseInt(cells[i]) :
            cells[i];
        }

        data.push(resource);
      }

      lineCount++;
    });

    fileHandler.on('close', () => {
      resolve(data);
    });
  });
}


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mmcmrtadb', function (err) {
   if (err) throw err;
   console.log('Successfully to Database connected');
});

// mongoose.connect('mongodb://root:secret@localhost:27017/mmcmrtadb?authSource=admin', { useNewUrlParser: true });


const StopTime = require('./models/gtfs/stop-time')




const DATABASE = {
  agencies: [],
  routes: [],
  trips: [],
  stops: [],
  calendar: [],
  shapes: [],
  periods: [],
  route_infos: []
};


async function init() {

  agency_key = "MRTA_Transit"
  DATABASE.stop_times = await loadGTFSDataFromFile('./feed/stop_times.txt', agency_key);


  console.log("Summary Report On Initialdatabase")
  console.log("---------------------------------")
  
  
  await StopTime.deleteMany({})
  await StopTime.insertMany(DATABASE.stop_times)
  await StopTime.count({}, function(err, count){
    console.log( "Number of StopTime record: ", count );
  });


  return 1
};

module.exports =  {
  init,
  DATABASE
}
