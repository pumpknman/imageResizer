import sharp from "sharp";

export default async function handler(req, res) {
  const fetch = (await import("node-fetch")).default; // ✅ 동적 import 사용
  const { url, width, height } = req.query;

  if (!url || !width || !height) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // ✅ 이미지 가져오기
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");

    const buffer = await response.buffer(); // ✅ arrayBuffer() 대신 사용

    // ✅ 강제 리사이징 적용 (비율 유지 X, 강제 크기 변경)
    const resizedImage = await sharp(buffer)
      .resize(parseInt(width), parseInt(height), { fit: "fill" }) // 🔥 비율 무시하고 강제 리사이징
      .toFormat("jpeg") // ✅ JPEG 변환 (서버 호환성 개선)
      .toBuffer();

    // ✅ 응답 설정
    res.setHeader("Content-Type", "image/jpeg");
    res.send(resizedImage);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ error: "Image processing failed" });
  }
}
