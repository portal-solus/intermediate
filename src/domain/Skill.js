const { capitalizeName, formatURL, formatPhone, removeAccent } = require("../format");
const { columnValue } = require("../sheets");

const descRgxSplitter = /;/;
const NDrgx = /(N\/D)/;
const spaceRgx = /( )/;
const dotRgx = /^.+\..+$/; // match "bsa.legal" which is a valid url

const checkUrl = (url) => !url.match(spaceRgx) && url.match(dotRgx);

class Skill {
  static ID = 1;
  static keys = [
    "inspect.name",
    "inspect.bond",
    "inspect.groupNames",
    "inspect.groupsInitials",
    "inspect.descriptionsSkills",
    "inspect.descriptionsServices",
    "inspect.descriptionsEquipments",
    "inspect.keywords",
  ];

  constructor(
    name,
    email,
    unity,
    campus,
    bond,
    categories,
    groupNames,
    groupInitials
  ) {
    this.inspect = {};

    this.id = Skill.ID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);

    this.email = email;
    this.unity = unity;
    this.campus = campus;
    this.bond = bond.replace(NDrgx, "");
    this.inspect.bond = removeAccent(this.bond);

    this.categories = categories;
    
    const groupsInitials = groupInitials.replace(NDrgx, "").split(descRgxSplitter);
    this.groups = groupNames.replace(NDrgx, "").split(descRgxSplitter).map((groupName, i) => ({
      groupName,
      groupInitials: groupsInitials[i]
    }))
    this.inspect.groupNames = groupNames.replace(NDrgx, "").split(descRgxSplitter).map((el) => removeAccent(el));
    this.inspect.groupsInitials = groupsInitials.map((el) => removeAccent(el));

    this._descriptions = {
      skills: [],
      services: [],
      equipments: [],
    };
    this._area = {
      major: "",
      minors: [],
    };
    this._phone = "";
    this._url = "";
    this._keywords = [];
    this._lattes = "";
    this._picture = "";
  }

  set phone(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._phone = formatPhone(rawColumn);
    }
  }

  get phone() {
    return this._phone;
  }

  set url(rawColumn) {
    if (rawColumn != undefined && rawColumn != "" && rawColumn != "N/D") {
      this._url = formatURL(rawColumn);
    }
  }

  get url() {
    return this._url;
  }

  set descriptionsSkills(rawColumn) {
    if (rawColumn != undefined && rawColumn != "" && rawColumn != "N/D") {
      this._descriptions.skills = rawColumn.split(descRgxSplitter);

      this.inspect.descriptionsSkills = this._descriptions.skills.map(removeAccent);
    }
  }

  set descriptionsServices(rawColumn) {
    if (rawColumn != undefined && rawColumn != "" && rawColumn != "N/D") {
      this._descriptions.services = rawColumn.split(descRgxSplitter);

      this.inspect.descriptionsServices = this._descriptions.services.map(removeAccent);
    }
  }

  set descriptionsEquipments(rawColumn) {
    if (rawColumn != undefined && rawColumn != "" && rawColumn != "N/D") {
      this._descriptions.equipments = rawColumn.split(descRgxSplitter);

      this.inspect.descriptionsEquipments = this._descriptions.equipments.map(removeAccent);
    }
  }

  get descriptions() {
    return Object.assign({}, this._descriptions);
  }

  set areaMajor(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._area.major = rawColumn;
    }
  }

  set areaMinors(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._area.minors = rawColumn.split(/,;/);
    }
  }

  get area() {
    return Object.assign({}, this._area);
  }

  set keywords(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._keywords = rawColumn.split(";");

      this.inspect.keywords = this._keywords.map(removeAccent);
    }
  }

  get keywords() {
    return this._keywords;
  }

  set lattes(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._lattes = rawColumn;
    }
  }

  get lattes() {
    return this._lattes;
  }

  set picture(rawColumn) {
    if (rawColumn != undefined && rawColumn != "") {
      this._picture = rawColumn;
    }
  }

  get picture() {
    return this._picture;
  }

  matchesFilter({ primary, secondary, terciary }) {
    let primaryMatch = true;
    let secondaryMatch = true;
    let terciaryMatch = true;

    if (primary.length > 0) {
      primaryMatch = primary.includes(this.area.major);
    }

    if (secondary.length > 0) {
      secondaryMatch = this.area.minors.some((minor) =>
        secondary.includes(minor)
      );
    }

    const [campus, unity] = terciary;

    if (campus) {
      terciaryMatch = this.campus === campus;
    }

    if (unity) {
      terciaryMatch = terciaryMatch && this.unity === unity;
    }

    return primaryMatch && secondaryMatch && terciaryMatch;
  }
}

class SkillGenerator {
  static run(row) {
    const base = new Skill(
      capitalizeName(columnValue(row, "C")),
      columnValue(row, "D"),
      columnValue(row, "F"),
      columnValue(row, "G"),
      columnValue(row, "H"),
      columnValue(row, "I"),
      columnValue(row, "J"),
      columnValue(row, "K")
    );

    base.phone = columnValue(row, "AE");
    base.descriptionsSkills = columnValue(row, "W");
    base.descriptionsServices = columnValue(row, "X");
    base.descriptionsEquipments = columnValue(row, "Y");
    base.areaMajor = columnValue(row, "Z");
    base.areaMinors = columnValue(row, "AA");
    base.keywords = columnValue(row, "AB");
    base.lattes = columnValue(row, "AC");

    const skillUrl = columnValue(row, "L");

    if (checkUrl(skillUrl))
      base.url = skillUrl;    

    const picID = columnValue(row, "AD");

    if (picID != undefined && picID != "N/D")
      base.picture = `https://drive.google.com/uc?export=view&id=${picID}`;

    return base;
  }
}

module.exports = { Skill, SkillGenerator }
