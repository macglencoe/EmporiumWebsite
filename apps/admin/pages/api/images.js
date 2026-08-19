// pages/api/images/index.js

import fs from 'fs';
import { IncomingForm } from 'formidable';
import { put, del } from '@vercel/blob';

export const config = {
  api: {
    // disable the default JSON/body parser so we can handle multipart
    bodyParser: false,
  }
};

export default async function handler(req, res) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  switch (req.method) {
    // ─────── UPLOAD ───────
    case 'POST': {
      const form = new IncomingForm({ multiples: false });

      return form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(422).json({ message: 'File upload error: ' + err.message });
        }

        const fileField = files.file;
        // formidable v2 may give you an array or a single file
        const fileObj = Array.isArray(fileField) ? fileField[0] : fileField;
        if (!fileObj || !fileObj.filepath) {
          return res.status(400).json({ message: 'No file provided under “file” key.' });
        }

        try {
          const data     = fs.readFileSync(fileObj.filepath);
          const mimeType = fileObj.mimetype || 'application/octet-stream';
          // you can customize the blob path however you like:
          const blobPath = `images/${Date.now()}-${fileObj.originalFilename}`;

          const blob = await put(blobPath, data, {
            access: 'public',
            contentType: mimeType,
            token
          });

          return res.status(201).json({ url: blob.url });
        } catch (uploadErr) {
          return res.status(500).json({ message: 'Upload failed: ' + uploadErr.message });
        }
      });
    }

    // ─────── DELETE ───────
    case 'DELETE': {
      // we disabled bodyParser, so we’ll take the URL to delete from the query:
      const { url } = req.query;
      if (!url) {
        return res.status(400).json({ message: 'Missing ?url=<blob-url> to delete.' });
      }

      try {
        await del(url, { token });
        return res.status(200).json({ message: 'Image deleted successfully' });
      } catch (delErr) {
        return res
          .status(500)
          .json({ message: 'Error deleting image: ' + delErr.message });
      }
    }

    // ─────── FALLBACK ───────
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
