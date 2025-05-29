import express from "express";
import cors from "cors";
import "dotenv/config";
import connectToDb from "./config/db.js";
import routes from "./routes/auth.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import { userVerify } from "./middleware/auth.middleware.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 2002;

app.use("/api/auth", routes);
app.use("/api", userVerify, expenseRoutes);

connectToDb();

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
