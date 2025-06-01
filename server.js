import express from "express";
import { shortenedRoutes } from "./routes/shortener.routes.js";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;


 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);


// console.log(__dirname)

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");


app.use(shortenedRoutes);

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"..",'public', 'not-found.html'))
})


app.listen(PORT, () => {
  console.log(`🚀 Server Running at http://localhost:${PORT}`);
});
