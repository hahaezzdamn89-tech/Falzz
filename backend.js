// api/remove-bg.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  try {
    const { image_url } = req.body;
    if (!image_url) return res.status(400).json({error:'No image URL provided'});

    const apiKey = process.env.PIXELCUT_API_KEY;
    if (!apiKey) return res.status(500).json({error:'API key not set'});

    const response = await fetch('https://api.developer.pixelcut.ai/v1/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image_url,
        format: 'png'
      })
    });

    const data = await response.json();
    if (!data || !data.result_url) return res.status(500).json({error:'Failed to process image'});

    res.status(200).json({result_url: data.result_url});
  } catch(err) {
    res.status(500).json({error: err.message});
  }
}