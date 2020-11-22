import { formatURL, removeAccent } from '../format';
import { indexColumns } from '../sheets';

interface Description {
  long: string;
  short?: string;
}

interface Category {
  business: boolean;
  enterpreneurship: boolean;
  innovation: boolean;
  intellectualProperty: boolean;
}

export class Discipline {
  private static nextID: number = 1;

  public inspect: any = {};
  public id: number;

  constructor(
    public readonly name: string,
    public readonly campus: string,
    public readonly unity: string,
    public readonly description: Description,
    public readonly startDate: string,
    public readonly level: string,
    public readonly url: string,
    public readonly category: Category,
  ) {
    this.id = Discipline.nextID++;
    this.inspect.name = removeAccent(this.name);
    this.inspect.descriptionLong = removeAccent(this.description.long);
    this.inspect.descriptionShort = removeAccent(this.description.short);
  }
}

export class DisciplineGenerator {
  static run(row: []): Discipline {
    const hash: any = indexColumns(row);

    const url =         DisciplineGenerator.handleUrl(hash["D"]);
    const name =        DisciplineGenerator.handleName(hash["A"]);
    const level =       DisciplineGenerator.handleLevel(hash["M"]);
    const unity =       DisciplineGenerator.handleUnity(hash["C"]);
    const campus =      DisciplineGenerator.handleCampus(hash["B"]);
    const category =    DisciplineGenerator.handleCategory(hash);
    const startDate =   DisciplineGenerator.handleDate(hash["G"]);
    const description = DisciplineGenerator.handleDescription(hash);


    const discipline: Discipline = new Discipline(
      name,
      campus,
      unity,
      description,
      startDate,
      level,
      url,
      category,
    );

    return discipline;
  }

  private static handleName(rawName: string): string {
    return `${rawName}`;
  }

  private static handleCampus(rawCampus: string): string {
    return `${rawCampus}`;
  }

  private static handleUnity(rawUnity: string): string {
    return `${rawUnity}`
  }

  private static handleDescription(indexed: any): Description {
    return {
      long: indexed["E"] ? indexed["E"] : "",
      short: indexed["F"] ? indexed["F"] : "",
    }
  }

  private static handleDate(rawDate: string): string {
    return `${rawDate}`;
  }

  private static handleLevel(rawLevel: string): string {
    return `${rawLevel}`;
  }

  private static handleUrl(rawUrl: string): string {
    if (rawUrl.match(/(n\/d| )/i))
      return "";

    return formatURL(rawUrl);
  }

  private static handleCategory(indexed: any): Category {
    return {
      business: indexed["I"] && indexed["I"].length,
      enterpreneurship: indexed["J"] && indexed["J"].length,
      innovation: indexed["K"] && indexed["K"].length,
      intellectualProperty: indexed["L"] && indexed["L"].length,
    }
  }
}
