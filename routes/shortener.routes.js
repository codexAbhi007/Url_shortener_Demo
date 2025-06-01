import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  loadURLShortener,
  postURLShortener,
} from "../controllers/postshortener.controller.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log(__filename)

//Routes
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "form.html"));
});

router.post("/shorten", postURLShortener);

router.get("/:code", loadURLShortener);

// router.get("/report/:name", (req, res) => {
//     const name = req.params.name
//   res.render("report",{name}); // renders views/index.ejs
// });

export const shortenedRoutes = router;
