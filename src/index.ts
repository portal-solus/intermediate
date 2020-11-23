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

const promises = pairs.map(({ sheetID, sheetName, obj }: any): Promise<any> => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/'${sheetName}'?key=${apiKey}`;
    return axios.get(url);
});


(async (): Promise<any> => {
    const data = await Promise.all(promises);

    pairs.forEach(({ obj }: any, i: number) => {
        db[pluralize(obj)] = data[i].data.values
            .slice(1)
            .map(domain[`${obj}Generator`].run)
    });

    const skillAgg = db['Skills'].reduce((agg: any[], skill: any) => {
        if (!agg[skill.area.major]) {
            agg[skill.area.major] = {};
        }

        skill.area.minors.forEach((minor: string) => {
            if (!agg[skill.area.major][minor]) {
                agg[skill.area.major][minor] = [];
            }

            agg[skill.area.major][minor].push(skill);
        });

        return agg;
    }, []);

    console.log(skillAgg)

    writeDatabase(db);
})();
