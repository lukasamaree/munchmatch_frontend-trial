import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import multer from 'multer';
import { NextApiRequestWithFiles } from '../../types/next';
import { createReadStream } from 'fs';

// Configure multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper to promisify multer
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequestWithFiles,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Process the upload
    await runMiddleware(req, res, upload.single('image'));
    
    const formData = new FormData();
    
    // Handle image file if present
    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('image', blob, req.file.originalname);
    }

    // Handle description if present
    if (req.body.description) {
      formData.append('description', req.body.description);
    }

    // Handle number of recipes
    if (req.body.num_recipes) {
      formData.append('num_recipes', req.body.num_recipes);
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