const { formatURL, removeAccent } = require("../format");

let ID = 1;

const spaceRgx = /( )/;
const dotRgx = /.+\..+/; // match "bsa.legal" which is a valid url

const checkUrl = (url) => !url.match(spaceRgx) && url.match(dotRgx);

function formatInput(rawColumn) {
  if (rawColumn == "N/D")
    return undefined;
  return rawColumn;
}

class PDI {
  static keys = [
    "inspect.name",
    "inspect.descriptionShort",
    "inspect.descriptionLong",
    "inspect.knowledge",
    "inspect.keywords",
  ];

  constructor(name, category, campus, unity, description) {
    this.inspect = {};

    this.id = ID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);

    this.category = category;
    this.campus = campus;
    this.unity = unity;
    this.description = description;
    this.inspect.descriptionShort = removeAccent(this.description.short || "");
    this.inspect.descriptionLong = removeAccent(this.description.long || "");

    this._keywords = [];
    this._knowledge = [];
    this._url = "";
    this._coordinator = "";
    this._email = "";
    this._phone = "";
  }

  set keywords(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._keywords = rawColumn.split(/[,;]/);

      this.inspect.keywords = this._keywords.map(removeAccent);
    }
  }

  get keywords() {
    return this._keywords;
  }

  set url(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._url = formatURL(rawColumn);
    }
  }

  get url() {
    return this._url;
  }

  set knowledge(rawColumn) {
    if (rawColumn != undefined && rawColumn.length > 0) {
      this._knowledge = rawColumn.split(/[,;]/);

      this.inspect.knowledge = this._knowledge.map(removeAccent);
    }
  }

  get knowledge() {
    return this._knowledge;
  }

  set coordinator(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._coordinator = rawColumn;
    }
  }

  get coordinator() {
    return this._coordinator;
  }

  set email(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._email = rawColumn;
    }
  }

  get email() {
    return this._email;
  }

  set phone(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._phone = rawColumn;
    }
  }

  get phone() {
    return this._phone;
  }

  matchesFilter({ primary, terciary }) {
    let primaryMatch = true;
    let terciaryMatch = true;

    if (primary.length > 0) {
      primaryMatch = primary.includes(this.category);
    }

    const [campus] = terciary;

    if (campus) {
      terciaryMatch = this.campus === campus;
    }
    
    return primaryMatch && terciaryMatch;
  }
}

class PDIGenerator {
  static run(row) {
    const base = new PDI(row[1], row[0], formatInput(row[3]), formatInput(row[4]), {
      short: formatInput(row[10]),
      long: formatInput(row[11]),
    });

    if (checkUrl(row[6]))
      base.url = formatInput(row[6]);
    
    base._knowledge = row[12];
    base.keywords = row[14];
    base.coordinator = formatInput(row[5]);
    base.email = formatInput(row[7]);
    base.phone = formatInput(row[8]);
    
    return base;
  }
}

module.exports = { PDI, PDIGenerator }
