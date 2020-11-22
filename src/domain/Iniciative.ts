import { formatURL, removeAccent } from '../format';
import { indexColumns } from '../sheets';

interface Description {
  short: string;
  long: string;
}

interface Contact {
  person: string;
  info: string;
}

export class Iniciative {
  private static nextID: number = 1;

  public inspect: any = {};
  public id: number;

  constructor(
    public readonly name: string,
    public readonly category: string,
    public readonly description: Description,
    public readonly local: string,
    public readonly unity: string,
    public readonly email: string,
    public readonly startDate: string,
    public readonly keywords: string[],
    public readonly services: string,
    public readonly contact: Contact,
    public readonly url: string,
  ) {
    this.id = Iniciative.nextID++;
    this.inspect.name = removeAccent(this.name);
    this.inspect.descriptionLong = removeAccent(this.description.long);
    this.inspect.descriptionShort = removeAccent(this.description.short);
    this.inspect.keywords = this.keywords.map(removeAccent);
    this.inspect.services = removeAccent(this.services);
    this.inspect.contactPerson = removeAccent(this.contact.person);
  }
}

export class IniciativeGenerator {
  static run(row: []): Iniciative {
    const hash: any = indexColumns(row);

    const url =         IniciativeGenerator.handleUrl(hash["G"]);
    const name =        IniciativeGenerator.handleName(hash["B"]);
    const email =       IniciativeGenerator.handleEmail(hash["I"]);
    const local =       IniciativeGenerator.handleLocal(hash["D"]);
    const unity =       IniciativeGenerator.handleUnity(hash["E"]);
    const contact =     IniciativeGenerator.handleContact(hash);
    const category =    IniciativeGenerator.handleCategory(hash["A"]);
    const keywords =    IniciativeGenerator.handleKeywords(hash["F"]);
    const services =    IniciativeGenerator.handleServices(hash["N"]);
    const startDate =   IniciativeGenerator.handleDate(hash["K"]);
    const description = IniciativeGenerator.handleDescription(hash);



    const iniciative: Iniciative = new Iniciative(
      name,
      category,
      description,
      local,
      unity,
      email,
      startDate,
      keywords,
      services,
      contact,
      url,
    );

    return iniciative;
  }

  private static handleName(rawName: string): string {
    return `${rawName}`;
  }
  
  private static handleCategory(rawCategory: string): string {
    return `${rawCategory}`;
  }

  private static handleDescription(indexed: any): Description {
    return {
      short: indexed["C"] ? indexed["C"] : "",
      long: indexed["H"] ? indexed["H"] : "",
    }
  }

  private static handleLocal(rawLocal: string): string {
    return `${rawLocal}`;
  }

  private static handleUnity(rawUnity: string): string {
    return `${rawUnity}`;
  }

  private static handleEmail(rawEmail: string): string {
    return `${rawEmail}`;
  }

  private static handleDate(rawDate: string): string {
    return `${rawDate}`;
  }

  private static handleKeywords(kw: string): string[] {
    return kw.split(';');
  }

  private static handleServices(rawServices: string): string {
    return `${rawServices}`;
  }

  private static handleContact(indexed: any): Contact {
    return {
      person: indexed["L"],
      info: indexed["M"],
    };
  }

  private static handleUrl(rawUrl: string): string {
    if (rawUrl.match(/(n\/d| )/i))
      return "";

    return formatURL(rawUrl);
  }
}
