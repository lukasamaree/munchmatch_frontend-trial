import { NextApiRequest } from 'next';
import { Multer } from 'multer';

export interface NextApiRequestWithFiles extends NextApiRequest {
  file?: Express.Multer.File;
  files?: Express.Multer.File[];
} 