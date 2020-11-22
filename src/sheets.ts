export const columnValue: ([], string) => any = (row: [], colLetter: string): any => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const map = letters
    .concat(...letters.map((l) => `A${l}`))
    .concat(...letters.map((l) => `B${l}`));

  return row[map.findIndex((x) => x === colLetter)];
};


export const indexColumns: ([]) => any = (row) => {
  const dict = {};

  row.forEach((el, i) => {
    const major = Math.floor(i / 26) - 1;

    const minor = i % 26;

    let l = String.fromCharCode(65 + minor);
    if (major >= 0) {
      l = String.fromCharCode(65 + major) + l;
    }

    dict[l] = el;
  });

  return dict;
}
