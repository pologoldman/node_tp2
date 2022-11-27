const express = require('express')
const app = express()
const port = 3000
const unzip = require('unzip-stream')

app.get('/tp2', (req, res) => {
    const fs = require('fs')
    const csv = require('csv-parser')
    const resultats = [];
    const download = require('download');
    var i = 0;
    var countTrue = 0;
download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const fileName = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv()) 
 .on('data', (data) => resultats.push(data))
 .on('end', () => {
    resultats.forEach(element => {
        if(element.transfertSiege == 'true'){
            countTrue++;
        }
        i++;
    });
    let pourcentage = countTrue/i*100;
    res.send(`Environ ${pourcentage.toFixed(2)}% des compagnies ont transféré leurs sièges social`)
  });
 } else {
    entry.autodrain();
}
})
})
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))