import fetch from "node-fetch";
import formidable from "formidable-serverless";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Failed to parse form");
    const file = files.image;
    if (!file) return res.status(400).send("No file uploaded");

    try {
      const formData = new FormData();
      formData.append("image", file.filepath ? file.filepath : file.file, file.originalFilename);
      formData.append("format", "png");

      const PIXELCUT_API_KEY = "sk_bdf73d44f60d448eb7f27c3d1ecd358e"; // ganti dengan key kamu

      const response = await fetch("https://api.developer.pixelcut.ai/v1/remove-background", {
        method: "POST",
        headers: {
          "X-API-KEY": sk_bdf73d44f60d448eb7f27c3d1ecd358e,
        },
        body: formData
      });

      if (!response.ok) throw new Error("PixelCut API error");
      const buffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(buffer));
    } catch (e) {
      console.error(e);
      res.status(500).send("Failed to remove background");
    }
  });
}