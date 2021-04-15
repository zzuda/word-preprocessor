import fs from "fs";
import { read, utils } from "xlsx";

function main(name: string) {
  const file = fs.readFileSync(`./sheets/${name}.xls`);
  const wb = read(file, { type: "buffer" });
  const firstSheet = wb.SheetNames[0];
  const sheet = wb.Sheets[firstSheet];
  const sheetJson = utils.sheet_to_json(sheet, {
    defval: "",
    blankrows: true,
  });

  const filteredWord = sheetJson
    .map((i) => {
      const item = i as Record<string, string>;
      if (item["어휘"].length === 1) return undefined;
      if (item["어휘"].length >= 4) return undefined;
      if (item["품사"] !== "명사") return undefined;
      if (item["어휘"].includes("-")) return undefined;
      return item;
    })
    .filter((i) => i !== undefined)
    .map((i) => i && i["어휘"]);
  const uniqueWord = new Set(filteredWord);
  const words = [...uniqueWord];

  fs.writeFileSync(`./dist/${name}.txt`, JSON.stringify(words));
}

main("830239_350000");
