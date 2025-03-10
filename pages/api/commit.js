


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Only POST requests are allowed." });
    }

    const { filePath, content, message, branch } = req.body;

    const owner = 'macglencoe';
    const repo = 'EmporiumWebsite';
    const token = process.env.GITHUB_TOKEN;


    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

    // Get the current file SHA (needed for updates)
    const getFile = await fetch(githubApiUrl, {
        headers: { Authorization: `Bearer ${token}` },
    });

    let sha = null;
    if (getFile.ok) {
        const fileData = await getFile.json();
        sha = fileData.sha;
    }

    // Prepare commit payload

    const commitPayload = {
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
        ...(sha && { sha }) // Include SHA for updates
    };

    // Commit the file
    const commitResponse = await fetch(githubApiUrl, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(commitPayload)

    });

    const commitData = await commitResponse.json();

    if (commitResponse.ok) {
        return res.status(200).json({ message: 'Committed successfully', commitData });
    } else {
        return res.status(commitResponse.status).json({ error: commitData });
    }
}