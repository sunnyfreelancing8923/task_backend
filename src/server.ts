import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 5000;

// Debug logs (important)
console.log("Starting server...");
console.log("PORT:", process.env.PORT);
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "OK" : "MISSING");

// Crash logs (VERY IMPORTANT)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
