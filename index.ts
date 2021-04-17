import fs from "fs";
import { read, utils } from "xlsx";

const WORD_COLUNM = "표제어";
const WORD_PARTS = "품사";

function checkKorean(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 55215) {
      return false;
    }
  }

  return true;
}

function getFileNameByArgs(): string {
  const myArgs = process.argv.slice(2);
  return myArgs[0];
}

function readSheet(name: string): Promise<Buffer> {
  const buffers: Buffer[] = [];
  const readStream = fs.createReadStream(name);
  return new Promise((resolve, reject) => {
    readStream.on("data", (c: Buffer) => {
      buffers.push(c);
    });

    readStream.on("end", () => {
      const buffer = Buffer.concat(buffers);
      resolve(buffer);
    });
  });
}

async function main() {
  const file = await readSheet(getFileNameByArgs());
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
  const writeStream = fs.createWriteStream(`./dist/${Date.now()}.txt`);
  const content = JSON.stringify(words).replace("]", "").replace("[", "");
  writeStream.write(content);
  writeStream.end();
}

main();
