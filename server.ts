import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Bookings
  app.post("/api/bookings", (req, res) => {
    const { name, phone, serviceName, date, time, notes } = req.body;
    
    console.log("New Booking Received:", { name, phone, serviceName, date, time, notes });

    // In a real app, you would save to database or send an email here.
    // Since this is a demonstration, we'll simulate success.
    
    if (!name || !phone || !serviceName || !date || !time) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ các thông tin bắt buộc." });
    }

    res.status(200).json({ 
      message: "Đặt lịch thành công!",
      bookingId: Math.random().toString(36).substring(7)
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
