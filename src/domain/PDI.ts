import { formatPhone, removeAccent } from '../format';
import { indexColumns } from '../sheets';

interface Description {
  short: string;
  long: string;
}

export class PDI {
  private static nextID: number = 1;

  public readonly inspect: any = {};
  public readonly id: number;

  constructor(
    public readonly name: string,
    public readonly category: string,
    public readonly campus: string,
    public readonly unity: string,
    public readonly description: Description,
    public readonly keywords: string[],
    public readonly knowledge: string,
    public readonly coordinator: string,
    public readonly email: string,
    public readonly phone: string,
  ) {
    this.id = PDI.nextID++;
    this.inspect.name = removeAccent(this.name);
    this.inspect.descriptionLong = removeAccent(this.description.long);
    this.inspect.descriptionShort = removeAccent(this.description.short);
    this.inspect.keywords = this.keywords.map(removeAccent);
    this.inspect.knowledge = removeAccent(this.knowledge);
    this.inspect.coordinator = removeAccent(this.coordinator);
  }
}

export class PDIGenerator {
  static run(row: []): PDI {
    const hash: any = indexColumns(row);

    const name =        PDIGenerator.handleName(hash["B"]);
    const email =       PDIGenerator.handleEmail(hash["H"]);
    const phone =       PDIGenerator.handlePhone(hash["I"]);
    const unity =       PDIGenerator.handleUnity(hash["E"]);
    const campus =      PDIGenerator.handleCampus(hash["D"]);
    const category =    PDIGenerator.handleCategory(hash["A"]);
    const keywords =    PDIGenerator.handleKeywords(hash["O"]);
    const knowledge =   PDIGenerator.handleKnowledge(hash["M"])
    const coordinator = PDIGenerator.handleCoordinator(hash["F"]);
    const description = PDIGenerator.handleDescription(hash);

    const pdi = new PDI(
      name,
      category,
      campus,
      unity,
      description,
      keywords,
      knowledge,
      coordinator,
      email,
      phone,
    );

    return pdi;
  }

  private static handleName(rawName: string): string {
    return rawName || "";
  }

  private static handleCategory(rawCategory: string): string {
    return rawCategory || "";
  }

  private static handleCampus(rawCampus: string): string {
    return rawCampus || "";
  }

  private static handleUnity(rawUnity: string): string {
    return rawUnity || "";
  }

  private static handleDescription(indexed: any): Description {
    return {
      short: indexed["K"],
      long: indexed["L"],
    }
  }

  private static handleKeywords(kw: string): string[] {
    return kw.split(';');
  }

  private static handleKnowledge(kn: string): string {
    return kn || "";
  }

  private static handleCoordinator(coord: string): string {
    return coord || "";
  }

  private static handleEmail(raw: string): string {
    return raw || "";
  }

  private static handlePhone(raw: string): string {
    if (!raw)
      return "";

    return formatPhone(raw);
  }
}
