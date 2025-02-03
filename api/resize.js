import sharp from "sharp";

export default async function handler(req, res) {
  const fetch = (await import("node-fetch")).default; // ✅ 동적 import 사용
  const { url, width, height } = req.query;

  if (!url || !width || !height) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer(); // ✅ 최신 fetch API 방식 적용

    const resizedImage = await sharp(Buffer.from(buffer))
      .resize(parseInt(width), parseInt(height))
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(resizedImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Image processing failed" });
  }
}
