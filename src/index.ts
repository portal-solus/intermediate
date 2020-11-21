import * as dotenv from 'dotenv';
import axios from 'axios';
import { resolve } from 'path';
import * as fs from 'fs';
import { domain } from './domain';

dotenv.config();

const apiKey = process.env.SHEETS_API_KEY;

const pairs: any[] = [
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

const pluralize: (string) => string = (str: string): string => {
    if (str[str.length - 1] == "y")
        return str.substr(0, str.length - 1) + "ies";

    return str + "s";
}

const writeDatabase: (any) => void = (db: any): void => {
    const pathToFile = resolve('.', 'db.json');

    fs.writeFile(pathToFile, JSON.stringify(db, null, 2), (err) => {
        if (err) {
            throw err;
        }

        console.log("DB written successfully");
    });
}

const db = {};

pairs.forEach((pair: any): void => {
    const { sheetID, sheetName, obj }: any = pair;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/'${sheetName}'?key=${apiKey}`;

    axios
        .get(url)
        .then((data: any): void => {
            const { data: { values } }: any = data;
            db[pluralize(obj)] = values.slice(1).map(domain[`${obj}Generator`].run);
            if (Object.keys(db).length == 5)
                writeDatabase(db);
        })
        .catch(err => console.log(err, "\n\n"))
});

