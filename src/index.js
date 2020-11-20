require('dotenv').config();
const axios = require("axios");
const fs = require('fs');
const { resolve } = require('path');
const domain = require('./domain');

const apiKey = process.env.SHEETS_API_KEY;

const pairs = [
  {
    sheetID: process.env.SKILL_ID,
    sheetName: "COMPETENCIAS",
    obj: 'Skill',
  }, {
    sheetID: process.env.COMPANY_ID,
    sheetName: "EMPRESAS",
    obj: 'Company',
  }, {
    sheetID: process.env.INICIATIVE_ID,
    sheetName: "INICIATIVAS",
    obj: 'Iniciative',
  }, {
    sheetID: process.env.PATENT_ID,
    sheetName: "PATENTES",
    obj: 'Patent',
  }, {
    sheetID: process.env.PDI_ID,
    sheetName: "PDI",
    obj: 'PDI',
  }
]

const pluralize = (str) => {
    if (str[str.length - 1] == "y")
        return str.substr(0, str.length - 1) + "ies";

    return str + "s";
}

const writeDatabase = (db) => {
    const pathToFile = resolve('.', 'db.json');

    fs.writeFile(pathToFile, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            throw err;
        }

        console.log("DB written successfully");
    });
}

const db = {};

pairs.forEach(({ sheetID, sheetName, obj }) => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/'${sheetName}'?key=${apiKey}`;

    axios
        .get(url)
        .then(({ data: { values } }) => {
            db[pluralize(obj)] = values.slice(1).map(domain[`${obj}Generator`].run);
            if (Object.keys(db).length == 5)
                writeDatabase(db);
        })
        .catch(err => console.log(err, "\n\n"))
});

