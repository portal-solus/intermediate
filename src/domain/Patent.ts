import { fixPersonName, removeAccent } from "../format";
import { columnValue, indexColumns } from "../sheets";

export class Patent {
  private static nextID = 1;

  public inspect: any = {};
  public id: number;

  constructor(
    public readonly name: string,
    public readonly sumary: string,
    public readonly classification: string,
    public readonly ipcs: string[],
    public readonly owners: string[],
    public readonly status: string,
    public readonly url: string,
    public readonly photo: string,
    public readonly inventors: string[],
    public readonly countriesWithProtection: string[],
  ) {
    this.id = Patent.nextID++;
    this.inspect.name = removeAccent(this.name);
    this.inspect.summary = removeAccent(this.sumary);
    this.inspect.owners = this.owners.map(removeAccent);
    this.inspect.inventors = this.inventors.map(removeAccent);
  }
}

export class PatentGenerator {
  static run(row: []): Patent {
    const hash = indexColumns(row);

    const url =                     PatentGenerator.handleUrl(hash[""]);
    const ipcs =                    PatentGenerator.handleIPCS(hash[""]);
    const name =                    PatentGenerator.handleName(hash[""]);
    const photo =                   PatentGenerator.handlePhoto(hash[""]);
    const owners =                  PatentGenerator.handleOwners(hash[""]);
    const status =                  PatentGenerator.handleStatus(hash[""]);
    const summary =                 PatentGenerator.handleSummary(hash[""]);
    const inventors =               PatentGenerator.handleInventors(hash[""]);
    const classification =          PatentGenerator.handleClassification(hash[""]);
    const countriesWithProtection = PatentGenerator.handleCountries(hash[""]);

    const patent = new Patent(
      name,
      summary,
      classification,
      ipcs,
      owners,
      status,
      url,
      photo,
      inventors,
      countriesWithProtection,
    );

    return patent;
  }

    private static handleUrl(raw: string): string {
      return `${raw}`;
    }

    private static handleIPCS(raw: string): string[] {
      return raw.split(";");
    }

    private static handleName(raw: string): string {
      return `${raw}`;
    }

    private static handlePhoto(raw: string): string {
      return `${raw}`;
    }

    private static handleOwners(raw: string): string[] {
      return raw.split(";");
    }

    private static handleStatus(raw: string): string {
      return `${raw}`;
    }

    private static handleSummary(raw: string): string {
      return `${raw}`;
    }

    private static handleInventors(raw: string): string[] {
      return raw.split(";");
    }

    private static handleClassification(raw: string): string {
      return `${raw}`;
    }

    private static handleCountries(raw: string): string[] {
      return raw.split(";");
    }

}

