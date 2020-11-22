import { formatURL, formatPhone, removeAccent } from "../format";
import { indexColumns } from "../sheets";

interface Descriptions {
  skills: string;
  services: string;
  equipments: string;
}

export class Skill {
  private static nextID = 1;

  public inspect: any = {};
  public id: number;


  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly unity: string,
    public readonly campus: string,
    public readonly bond: string,
    public readonly categories: string,
    public readonly descriptions: Descriptions,
    public readonly area: string,
    public readonly phone: string,
    public readonly url: string,
    public readonly keywords: string[],
    public readonly lattes: string,
    public readonly picture: string,
  ) {
    this.id = Skill.nextID++;
    this.name = name;
    this.inspect.name = removeAccent(this.name);
    this.inspect.bond = removeAccent(this.bond);
    this.inspect.descriptionsSkills = removeAccent(this.descriptions.skills);
    this.inspect.descriptionsServices = removeAccent(this.descriptions.services);
    this.inspect.descriptionsEquipments = removeAccent(this.descriptions.equipments);
    this.inspect.keywords = this.keywords.map(removeAccent);
  }
}

export class SkillGenerator {
  static run(row) {
    const hash = indexColumns(row);

    const url =           SkillGenerator.handleUrl(hash["L"]);
    const area =          SkillGenerator.handleArea(hash);
    const bond =          SkillGenerator.handleBond(hash["H"]);
    const name =          SkillGenerator.handleName(hash["C"]);
    const email =         SkillGenerator.handleEmail(hash["D"]);
    const unity =         SkillGenerator.handleUnity(hash["F"]);
    const phone =         SkillGenerator.handlePhone(hash["AE"]);
    const campus =        SkillGenerator.handleCampus(hash["G"]);
    const lattes =        SkillGenerator.handleLattes(hash["AC"]);
    const picture =       SkillGenerator.handlePicture(hash["AD"]);
    const keywords =      SkillGenerator.handleKeywords(hash["AB"]);
    const categories =    SkillGenerator.handleCategories(hash["I"]);
    const descriptions =  SkillGenerator.handleDescriptions(hash);

    const skill = new Skill(
      name,
      email,
      unity,
      campus,
      bond,
      categories,
      descriptions,
      area,
      phone,
      url,
      keywords,
      lattes,
      picture,
    );

    return skill;
  }
    private static handleUrl(raw: string): string {
      if (!raw)
        return "";

      return formatURL(raw);
    }

    private static handleArea(indexed: any): any {
      return {
        major: indexed["Z"],
        minors: indexed["AA"].split(';'),
      }
    }

    private static handleBond(raw: string): string {
      return raw || ""; 
    }

    private static handleName(raw: string): string {
      return raw || ""; 
    }

    private static handleEmail(raw: string): string {
      return raw || ""; 
    }

    private static handleUnity(raw: string): string {
      return raw || ""; 
    }

    private static handlePhone(raw: string): string {
      if (!raw)
        return "";

      return formatPhone(raw);
    }

    private static handleCampus(raw: string): string {
      return raw || ""; 
    }

    private static handleLattes(raw: string): string {
      if (!raw)
        return "";

      return formatURL(raw);
    }

    private static handlePicture(raw: string): string {
      if (!raw)
        return "";

      return `https://drive.google.com/uc?export=view&id=${raw}`;
    }

    private static handleKeywords(raw: string): string[] {
      if (!raw)
        return [];

      return raw.split(';');
    }

    private static handleCategories(raw: string): string {
      return raw || "";
    }

    private static handleDescriptions(indexed: any): Descriptions {
      return {
        skills: indexed["W"],
        services: indexed["X"],
        equipments: indexed["Y"],
      }
    }

}

