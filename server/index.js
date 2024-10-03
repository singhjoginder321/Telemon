const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Import fs module

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route for uploading an image
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.originalname}`;
  const coordinates = [[50, 50, 100, 100]]; // Example coordinates

  res.json({ message: "Image uploaded successfully!", imageUrl, coordinates });
});

// New route to get the image URL
app.get("/api/image/:imageName", (req, res) => {
  const { imageName } = req.params;
  const imageUrl = `http://localhost:${PORT}/uploads/${imageName}`;

  // Check if the file exists
  const filePath = path.join(__dirname, "uploads", imageName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found" });
  }

  res.json({ imageUrl });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
