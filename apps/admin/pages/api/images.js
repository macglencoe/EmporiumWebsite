// pages/api/images/index.js

import { IncomingForm } from 'formidable';
import { withAuth } from '../../lib/auth/server.mjs';
import { adminDatabase } from '../../lib/catalog/server.mjs';
import { deleteImageIfUnreferenced, ImageValidationError, MAX_IMAGE_BYTES, uploadImage } from '../../lib/images/server.mjs';

export const config = {
  api: {
    // disable the default JSON/body parser so we can handle multipart
    bodyParser: false,
  }
};

async function handler(req, res) {
  switch (req.method) {
    // ─────── UPLOAD ───────
    case 'POST': {
      const form = new IncomingForm({ multiples: false, maxFileSize: MAX_IMAGE_BYTES });

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
          const image = await uploadImage(fileObj, { productId: String(fields.productId?.[0] || fields.productId || '') });
          return res.status(201).json(image);
        } catch (uploadErr) {
          if (uploadErr instanceof ImageValidationError) return res.status(400).json({ message: uploadErr.message });
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
        const result = await deleteImageIfUnreferenced(adminDatabase(), url);
        if (result.reason === 'referenced') return res.status(409).json({ message: 'Image is still referenced by a product or draft.' });
        if (result.reason === 'external') return res.status(400).json({ message: 'Only managed Vercel Blob images can be deleted.' });
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
export default withAuth(handler);
