import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const formData = new FormData();
    
    // Handle image file if present
    if (files.image && files.image[0]) {
      const file = files.image[0];
      const fileContent = fs.readFileSync(file.filepath);
      const blob = new Blob([fileContent], { type: file.mimetype || 'application/octet-stream' });
      formData.append('image', blob, file.originalFilename);
    }

    // Handle description if present
    if (fields.description && fields.description[0]) {
      formData.append('description', fields.description[0]);
    }

    // Handle number of recipes
    if (fields.num_recipes && fields.num_recipes[0]) {
      formData.append('num_recipes', fields.num_recipes[0]);
    }

    // Make request to Streamlit backend
    const response = await axios.post(process.env.STREAMLIT_BACKEND_URL || 'http://localhost:8501/api/search', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 