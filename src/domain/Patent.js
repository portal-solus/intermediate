const { fixPersonName, removeAccent } = require("../format");
const { columnValue } = require("../sheets");

class Patent {
  static ID = 1;
  static keys = [
    "inspect.name",
    "inspect.summary",
    "inspect.owners",
    "inspect.inventors",
    "inspect.ipcs",
  ];

  constructor(name, sumary, classification, ipcs, owners, status) {
    this.inspect = {};

    this.id = Patent.ID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);

    this.sumary = sumary;
    this.inspect.sumary = removeAccent(this.sumary);

    this.classification = classification;
    this.ipcs = ipcs;
    this.inspect.ipcs = this.ipcs.map(removeAccent);

    this.owners = owners;
    this.inspect.owners = this.owners.map(removeAccent);

    this.status = status;

    this._url = "";
    this._photo = "";
    this._inventors = [];
    this._countriesWithProtection = [];
  }

  set url(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._url = rawColumn;
    }
  }

  get url() {
    return this._url;
  }

  set inventors(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._inventors = rawColumn.split(" | ").map(fixPersonName);

      this.inspect.inventors = this._inventors.map(removeAccent);
    }
  }

  get inventors() {
    return this._inventors;
  }

  set countriesWithProtection(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._countriesWithProtection = rawColumn.split(";");
    }
  }

  get countriesWithProtection() {
    return this._countriesWithProtection;
  }

  set photo(rawColumn) {
    if (rawColumn !== undefined && rawColumn != " ") {
      this._photo = `https://drive.google.com/uc?export=view&id=${rawColumn}`;
    }
  }

  get photo() {
    return this._photo;
  }

  matchesFilter({ primary, secondary, terciary }, primaryAreaNameToCode) {
    const primaryCodes = primary.map(primaryAreaNameToCode);

    let doesMatch = true;

    if (primaryCodes.length != 0) {
      const primaryMatch =
        primaryCodes.includes(this.classification.primary.cip.substr(0, 1)) ||
        primaryCodes.includes(this.classification.secondary.cip.substr(0, 1));

      doesMatch = doesMatch && primaryMatch;
    }

    if (doesMatch && secondary.length != 0) {
      const secMatch =
        secondary.includes(this.classification.primary.subarea) ||
        secondary.includes(this.classification.secondary.subarea);

      doesMatch = doesMatch && secMatch;
    }

    if (terciary.length != 0) {
      const terMatch = terciary.includes(this.status);

      doesMatch = doesMatch && terMatch;
    }

    return doesMatch;
  }
}

class PatentGenerator {
  static run(row) {
    const base = new Patent(
      columnValue(row, "F"),
      columnValue(row, "K"),
      {
        primary: {
          cip: row[0].trim(),
          subarea: row[1].trim(),
        },
        secondary: {
          cip: row[2].trim(),
          subarea: row[3].trim(),
        },
      },
      columnValue(row, "G").split(" | "),
      columnValue(row, "I").split(" | "),
      columnValue(row, "M")
    );

    base.url = columnValue(row, "N");
    base.inventors = columnValue(row, "J");
    base.countriesWithProtection = columnValue(row, "L");
    base.photo = columnValue(row, "O");
    return base;
  }
}

module.exports = { Patent, PatentGenerator }
