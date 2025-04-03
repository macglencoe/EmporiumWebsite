import { del } from "@vercel/blob";


export default async function handler(req, res) {
    if (req.method == 'DELETE') {
        try {
            const urlToDelete = req.body;

            const token = process.env.BLOB_READ_WRITE_TOKEN;
            await del(urlToDelete, { token })

            res.status(200).json({ message: "Image deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: "Error deleting image: " + error.message || "Unknown error" })
        }

    } else {
        res.status(405).json({ message: `${req.method} requests are not allowed.` });
    }
}

