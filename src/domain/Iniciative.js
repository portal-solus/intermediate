const { columnValue } = require("../sheets");
const { formatURL, formatPhone, removeAccent } = require("../format");

const spaceRgx = /( )/;
const dotRgx = /^.+\..+$/; // match "bsa.legal" which is a valid url

const checkUrl = (url) => !url.match(spaceRgx) && url.match(dotRgx);

class Iniciative {
  static ID = 1;
  static keys = [
    "inspect.name",
    "inspect.descriptionLong",
    "inspect.descriptionShort",
    "inspect.keywords",
    "inspect.services",
  ];

  constructor(name, category, description, local, unity, email, startDate) {
    this.inspect = {};

    this.id = Iniciative.ID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);

    this.category = category;
    this.description = description;
    this.inspect.descriptionLong = removeAccent(this.description.long);
    this.inspect.descriptionShort = removeAccent(this.description.short);

    this.local = local;
    this.unity = unity;
    this.email = email;
    this.startDate = startDate;

    this._keywords = [];
    this._url = "";
    this._socialMedia = "";
    this._contact = {
      person: "",
      info: [],
    };
    this._services = "";
  }

  set keywords(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._keywords = rawColumn.split(/[;,]/)
        .filter(key => key.trim().length > 0)

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

  set socialMedia(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._socialMedia = rawColumn;
    }
  }

  get socialMedia() {
    return this._socialMedia;
  }

  set contactPerson(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._contact.person = rawColumn;
    }
  }

  set contactInfo(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._contact.info = rawColumn
        .split(";")
        .map((phone) => formatPhone(phone));
    }
  }

  get contact() {
    return Object.assign({}, this._contact);
  }

  set services(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._services = rawColumn;

      this.inspect.services = removeAccent(this._services);
    }
  }

  matchesFilter({ primary, terciary }) {
    let primaryMatch = true;
    let terciaryMatch = true;

    if (primary.length > 0)
      primaryMatch = primary.some(
        (p) => p.toLowerCase() === this.category.toLowerCase()
      );

    const [campus] = terciary;

    if (campus)
      terciaryMatch = this.local
        .split(",")
        .map((l) => l.trim())
        .includes(campus);

    return primaryMatch && terciaryMatch;
  }
}

class IniciativeGenerator {
  static run(row) {
    const base = new Iniciative(
      row[1],
      row[0],
      {
        short: row[2],
        long: row[7],
      },
      row[3],
      row[4],
      row[8],
      row[10]
    );

    base.keywords = columnValue(row, "F");
    base.socialMedia = row[9];
    base.services = row[13];
    base.contactPerson = row[11];
    base.contactInfo = columnValue(row, "M");

    const iniciativeUrl = columnValue(row, "G");

    if (checkUrl(iniciativeUrl))
      base.url = iniciativeUrl;

    return base;
  }
}

module.exports = { Iniciative, IniciativeGenerator }
