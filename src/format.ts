export const formatURL: (string) => string = (raw: string): string => {
  if (raw.match(/n\/d/i)) return "";

  return raw.substr(0, 4) == "http" ? raw : `http://${raw}`;
}

const tokenSeparator = " ";
export const capitalizeName: (string) => string = (raw: string): string =>
  raw
    .toLocaleLowerCase()
    .trim()
    .split(tokenSeparator)
    .filter((s) => s.trim().length > 0)
    .map((s) => {
      if (s != "de" && s != "do" && s != "da")
        return s[0].toLocaleUpperCase() + s.slice(1);
      return s;
    })
    .join(tokenSeparator);

export const fixPersonName: (string) => string = (name: string): string =>
  name.includes(",") ? name.split(",").reverse().join(" ") : name;

const eightDigits: (string) => string = (numbers: string): string => {
  const prefix = numbers.substr(0, 4);
  const sufix = numbers.substr(4, 4);

  return `${prefix}-${sufix}`;
};

const nineDigits: (string) => string = (numbers: string): string => {
  const prefix = numbers.substr(0, 5);
  const sufix = numbers.substr(5, 4);

  return `${prefix}-${sufix}`;
};

const dddEightDigits: (string) => string = (numbers: string): string => {
  const ddd = numbers.substr(0, 2);
  const number = numbers.substr(2, 8);

  return `(${ddd}) ${eightDigits(number)}`;
};

const dddNineDigits: (string) => string = (numbers: string): string => {
  const ddd = numbers.substr(0, 2);
  const number = numbers.substr(2, 9);

  return `(${ddd}) ${nineDigits(number)}`;
};

export const formatPhone: (string) => string = (raw: string): string => {
  if (!raw) return "";

  const numbers = raw.replace(/\D/g, "");

  switch (numbers.length) {
    case 8:
      return eightDigits(numbers);
    case 9:
      return nineDigits(numbers);
    case 10:
      return dddEightDigits(numbers);
    case 11:
      return dddNineDigits(numbers);
    default:
      return numbers;
  }
};

export const removeAccent: (string) => string = (rawStr: string): string => {
  let str = `${rawStr}`
  const variations = {};

  variations["a"] = /[áàãâä]/g;
  variations["e"] = /[éèẽêë]/g;
  variations["i"] = /[íìĩîï]/g;
  variations["o"] = /[óòõôö]/g;
  variations["u"] = /[úùũûü]/g;
  variations["c"] = /[ç]/g;
  variations["n"] = /[ñ]/g;

  Object.keys(variations).forEach((letter) => {
    str = str.replace(variations[letter], letter);
  });

  return str;
}
