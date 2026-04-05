import "dotenv/config";
import app from "./app";

// 🔥 Use Railway dynamic port
const PORT = process.env.PORT || 5000;

// ✅ Debug logs (optional but useful)
console.log("Starting server...");
console.log("PORT:", PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "MISSING");

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
