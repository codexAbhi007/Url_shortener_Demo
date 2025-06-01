import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "..", "urlData.json");

console.log(DATA_FILE);




export const loadData = () => {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    console.log(JSON.parse(raw));
    console.log(raw);
    return JSON.parse(raw);
  } catch {
    return {};
  }
};


export const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};
