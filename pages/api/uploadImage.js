import { put } from "@vercel/blob";
import fs from 'fs';
import { IncomingForm } from 'formidable';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js default bodyParser to handle file uploads manually
    },
};



export default async function handler(req, res) {

    if (req.method == 'POST') {

        const form = new IncomingForm({ multiples: false })

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(422).json({ message: "Failed to process file: " + err.message });
            }

            
            try {
                const file = files.file[0];

                if (!file || !file.filepath) {
                    return res.status(400).json({ message: "No valid file uploaded." });
                }

                const fileData = fs.readFileSync(file.filepath);
                const mimeType = file.mimetype || 'application/octet-stream';

    
    
                const blob = await put(`images/${file.originalFilename}`, fileData, {
                    access: 'public',
                    contentType: mimeType
                });
                res.status(200).json({ url: blob.url });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

    } else {
        res.status(405).json({ message: req.method + " requests are not allowed." });
    }
}