import { NextApiRequest } from 'next';
import { Multer } from 'multer';

declare module 'next' {
  interface NextApiRequestWithFiles extends NextApiRequest {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
} 