// server.ts
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // <-- import cors
import router from "./routes/route";
import { sequelize } from "./model/db";
import swagger from "./swagger/swaggerIndex";
import path from "path";

const app = express();
// Enable CORS for all routes
app.use(cors({
  origin: "*", // <-- allow all origins (you can restrict it to your frontend URL)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());
app.use("/api", router);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, path) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

const PORT = 3002;
swagger(app); 
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  console.log("📖 Swagger Docs available at http://localhost:3000/api-docs");
});
