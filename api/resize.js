import sharp from "sharp";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url, width, height } = req.query;

  if (!url || !width || !height) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const resizedImage = await sharp(buffer)
      .resize(parseInt(width), parseInt(height))
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(resizedImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Image processing failed" });
  }
}
