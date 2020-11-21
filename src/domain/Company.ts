import { removeAccent } from '../format';
import { indexColumns } from '../sheets';

interface Category {
  code: string;
  name: string;
}

interface Description {
  long: string;
}

interface Address {
  venue: string;
  neightborhood: string;
  city: string;
  state: string;
  cep: string;
}

export class Company {
  static nextID: number = 0;

  public inspect: any = {};
  public id: number;

  constructor(
    public readonly name: string,
    public readonly year: string,
    public readonly emails: string[],
    public readonly category: Category,
    public readonly description: Description,
    public readonly incubated: boolean,
    public readonly ecosystems: string[],
    public readonly services: string,
    public readonly address: Address,
  ) {
    this.id = Company.nextID++;
    this.inspect.name = removeAccent(this.name);
    this.inspect.descriptionLong = removeAccent(this.description.long);
    this.inspect.services = removeAccent(this.services);
  }
}

export class CompanyGenerator{
  static run(row: any[]): Company {
    const hash = indexColumns(row);

    const name =        CompanyGenerator.handleName(hash["AC"]);
    const year =        CompanyGenerator.handleYear(hash["AE"]);
    const emails =      CompanyGenerator.handleEmails(hash["AH"]);
    const address =     CompanyGenerator.handleAddress(hash)
    const category =    CompanyGenerator.handleCategory(hash["BY"]);
    const services =    CompanyGenerator.handleServices(hash["BD"]);
    const incubated =   CompanyGenerator.handleIncubated(hash["AR"]);
    const ecosystems =  CompanyGenerator.handleEcosystems(hash["AR"]);
    const description = CompanyGenerator.handleDescription(hash["BC"]);

    const company: Company = new Company(
      name,
      year,
      emails,
      category,
      description,
      incubated,
      ecosystems,
      services,
      address,
    );

    return company;
  }

  private static handleName(rawName: string): string {
    return `${rawName}`;
  }

  private static handleYear(rawYear: string): string {
    return `${rawYear}`;
  }

  private static handleEmails(rawEmails: string): string[] {
    return rawEmails.split(';');
  }

  private static handleCategory(rawCategory: string): Category {
    if (!rawCategory)
      return { code: '', name: '' };

    return {
      code: rawCategory.substr(0, 2),
      name: rawCategory.split(' ').slice(1).join(' '),
    };
  }

  private static handleDescription(rawDescription: string): Description {
    if(!rawDescription || rawDescription == '.')
      return { long: '' };

    return { long: rawDescription };
  }

  private static handleIncubated(rawIncubated: string): boolean {
    const rejectValues = [".", "Nenhum", "Nenhuma", "Não", "", undefined];

    return !rejectValues.includes(rawIncubated);
  }

  private static handleEcosystems(rawEcosystems: string): string[] {
    if (!CompanyGenerator.handleIncubated(rawEcosystems))
      return [];

    return rawEcosystems.split(';');
  }

  private static handleServices(rawServices: string): string {
    if (!rawServices || rawServices == ".")
      return "";

    return rawServices;
  }

  private static handleAddress(indexed: any): Address {
    return {
      venue: indexed["AJ"],
      neightborhood: indexed["AK"],
      city: indexed["AL"].split(';'),
      state: indexed["AM"],
      cep: indexed["AN"],
    }
  }
}