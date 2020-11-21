import { formatURL, removeAccent } from "../format";

export class Discipline {
  static ID = 1;
  static keys = [
    "inspect.name",
    "inspect.descriptionLong",
    "inspect.descriptionShort"
  ];

  public inspect: any = {};
  public id: any;
  public name: any;
  public campus: any;
  public unity: any;
  public description: any;
  public startData: any;
  public level: any;

  public _url: any;
  public _category: any;

  constructor(name, campus, unity, description, startData, level) {
    this.id = Discipline.ID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);

    this.campus = campus;
    this.unity = unity;
    this.description = description;
    this.inspect.descriptionLong = removeAccent(this.description.long || "");
    this.inspect.descriptionShort = removeAccent(this.description.short || "");

    this.startData = startData;
    this.level = level;

    this._url = "";
    this._category = {
      business: false,
      entrepreneurship: false,
      innovation: false,
      intellectualProperty: false,
    };
  }

  set url(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._url = formatURL(rawColumn);
    }
  }

  get url() {
    return this._url;
  }

  set categoryBusiness(rawColumn) {
    if (rawColumn != undefined) {
      this._category.business = rawColumn.length > 0;
    }
  }

  set categoryEntrepreneurship(rawColumn) {
    if (rawColumn != undefined) {
      this._category.entrepreneurship = rawColumn.length > 0;
    }
  }

  set categoryInnovation(rawColumn) {
    if (rawColumn != undefined) {
      this._category.innovation = rawColumn.length > 0;
    }
  }

  set categoryIntellectualProperty(rawColumn) {
    if (rawColumn != undefined) {
      this._category.intellectualProperty = rawColumn.length > 0;
    }
  }

  get category() {
    return Object.assign({}, this._category);
  }

  matchesFilter({ primary, terciary }) {
    const categories = [];
    let primaryMatch = true;
    let terciaryMatch = true;

    if (this.category.business) categories.push("Negócios");
    if (this.category.innovation) categories.push("Inovação");
    if (this.category.entrepreneurship) categories.push("Empreendedorismo");
    if (this.category.intellectualProperty)
      categories.push("Propriedade Intelectual");

    if (primary.length > 0) {
      primaryMatch = categories.some((cat) => primary.includes(cat));
    }

    const [campus, level] = terciary;

    if (campus != undefined) {
      terciaryMatch = this.campus === campus;
    }

    if (level != undefined) {
      terciaryMatch = terciaryMatch && this.level === level;
    }

    return primaryMatch && terciaryMatch;
  }
}

export class DisciplineGenerator {
  static run(row) {
    const base = new Discipline(
      row[0],
      row[1],
      row[2],
      {
        short: row[4],
        long: row[5],
      },
      row[6],
      row[12]
    );

    base.url = row[3];
    base.categoryBusiness = row[8];
    base.categoryEntrepreneurship = row[9];
    base.categoryInnovation = row[10];
    base.categoryIntellectualProperty = row[11];

    return base;
  }
}

