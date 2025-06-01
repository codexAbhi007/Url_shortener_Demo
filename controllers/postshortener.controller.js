import path from "path";
import { loadData, saveData } from "../models/shortener.model.js";
import crypto from "crypto"
import { fileURLToPath } from "url";

const generateCode=()=> {
  return crypto.randomBytes(3).toString("hex"); //6 char code
}
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);

 console.log(__dirname,__filename)

export const postURLShortener = (req, res) => {
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
}

export const loadURLShortener = (req,res)=>{
    const db = loadData();
    const target = db[req.params.code]

    if(target){
        res.redirect(target);
    }else{
        res.status(404).sendFile(path.join(__dirname, "..",'public','not-found.html'))
    }
}