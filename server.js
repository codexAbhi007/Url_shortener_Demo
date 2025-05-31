import express from "express";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from 'crypto';
import 'dotenv/config';
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "urlData.json");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//Utility functions
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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.post("/shorten", (req, res) => {
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
    res.status(500).sendFile(path.join(__dirname, "public", "error.html"));
  }
});


app.get('/:code',(req,res)=>{
    const db = loadData();
    const target = db[req.params.code]

    if(target){
        res.redirect(target);
    }else{
        res.status(404).sendFile(path.join(__dirname),'public','not-found.html')
    }
})

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'public','not-found.html'))
})


app.listen(PORT, () => {
  console.log(`🚀 Server Running at http://localhost:${PORT}`);
});
