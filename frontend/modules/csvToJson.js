const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

module.exports = function(){
let position = [];
fs.createReadStream(path.join(__dirname, './earth.csv'))
  .pipe(csv())
  .on('data', (row) => {
    row.x = Math.round(parseFloat(row.x));
    row.y = Math.round(parseFloat(row.y));
    row.z = Math.round(parseFloat(row.z));
    console.log("Row:", row);

    position.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    fs.writeFileSync('./json/earth.json', JSON.stringify({ position }));
  });

}
