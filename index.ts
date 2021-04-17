import fs from "fs";
import { read, utils } from "xlsx";

const WORD_COLUNM = "표제어";
const WORD_PARTS = "품사";

function checkKorean(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 55215) {
      return false;
    }
  }

  return true;
}

function getFileNameByArgs() {
  const myArgs = process.argv.slice(2);
  return myArgs[0];
}

function main() {
  const file = fs.readFileSync(getFileNameByArgs());
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
      if (item[WORD_COLUNM].length === 1) return undefined;
      if (item[WORD_COLUNM].length >= 4) return undefined;
      if (item[WORD_PARTS] !== "명사") return undefined;
      if (item[WORD_COLUNM].includes("-")) return undefined;
      if (!checkKorean(item[WORD_COLUNM])) return undefined;
      return item;
    })
    .filter((i) => i !== undefined)
    .map((i) => i && i[WORD_COLUNM]);
  const uniqueWord = new Set(filteredWord);
  const words = [...uniqueWord];

  if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist");
  }
  const stream = fs.createWriteStream(`./dist/${Date.now()}.txt`);
  const content = JSON.stringify(words).replace("]", "").replace("[", "");
  stream.write(content);
  stream.end();
}

main();
