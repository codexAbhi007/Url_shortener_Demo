
import fs from "fs";
import crypto from 'crypto';
import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const DATA_FILE = path.join(__dirname,"..", "urlData.json");
// console.log(__filename)


function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    console.log(JSON.parse(raw));
    console.log(raw);
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function generateCode() {
  return crypto.randomBytes(3).toString("hex"); //6 char code
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

//Routes
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"..", "public", "form.html"));
});

router.post("/shorten", (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;
    // console.log(req.body)
    // console.log(originalUrl, customCode)

    const db = loadData();

    let code = customCode.trim() || generateCode();

    if (db[code]) {
      res.send(`
                 <h2 style="color:red;">Code "${code}" already exists.</h2>
        <a href="/">Try Again</a>`);
    } else {
      db[code] = originalUrl;
      saveData(db);
      res.send(`
        <h2>Short URL Created!</h2>
        <p><a href="/${code}">localhost:3000/${code}</a></p>
        <a href="/">Shorten another</a>
      `);
    }
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).sendFile(path.join(__dirname, "..","public", "error.html"));
  }
});

router.get("/report/:name", (req, res) => {
    const name = req.params.name
  res.render("report",{name}); // renders views/index.ejs
});

router.get('/:code',(req,res)=>{
    const db = loadData();
    const target = db[req.params.code]

    if(target){
        res.redirect(target);
    }else{
        res.status(404).sendFile(path.join(__dirname, "..",'public','not-found.html'))
    }
})










export const shortenedRoutes = router