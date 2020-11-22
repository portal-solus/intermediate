import { fixPersonName, formatURL, removeAccent } from "../format";
import { columnValue, indexColumns } from "../sheets";

interface Classification {
  cip: string;
  subarea: string;
}

interface FullClassification {
  primary: Classification;
  secondary: Classification
}

export class Patent {
  private static nextID = 1;

  public inspect: any = {};
  public id: number;

  constructor(
    public readonly name: string,
    public readonly sumary: string,
    public readonly classification: FullClassification,
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

    const url =                     PatentGenerator.handleUrl(hash["N"]);
    const ipcs =                    PatentGenerator.handleIPCS(hash["G"]);
    const name =                    PatentGenerator.handleName(hash["F"]);
    const photo =                   PatentGenerator.handlePhoto(hash["O"]);
    const owners =                  PatentGenerator.handleOwners(hash["I"]);
    const status =                  PatentGenerator.handleStatus(hash["M"]);
    const summary =                 PatentGenerator.handleSummary(hash["K"]);
    const inventors =               PatentGenerator.handleInventors(hash["J"]);
    const classification =          PatentGenerator.handleClassification(hash);
    const countriesWithProtection = PatentGenerator.handleCountries(hash["L"]);

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
      if (!raw)
        return "";

      return formatURL(raw);
    }

    private static handleIPCS(raw: string): string[] {
      if (!raw)
        return [];

      return raw.split(" | ");
    }

    private static handleName(raw: string): string {
      return `${raw}`;
    }

    private static handlePhoto(raw: string): string {
      if (!raw)
        return "";

      return `https://drive.google.com/uc?export=view&id=${raw}`
    }

    private static handleOwners(raw: string): string[] {
      if (!raw)
        return [];

      return raw.split(" | ");
    }

    private static handleStatus(raw: string): string {
      return `${raw}`;
    }

    private static handleSummary(raw: string): string {
      return `${raw}`;
    }

    private static handleInventors(raw: string): string[] {
      if (!raw)
        return [];

      return raw.split(" | ").map(fixPersonName);
    }

    private static handleClassification(indexed: any): FullClassification {
      return {
        primary: {
          cip: indexed["A"].trim(),
          subarea: indexed["B"].trim(),
        },
        secondary: {
          cip: indexed["C"].trim(),
          subarea: indexed["D"].trim(),
        }
      }
    }

    private static handleCountries(raw: string): string[] {
      if (!raw)
        return [];

      return raw.split(';');
    }
}

