

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Only GET requests are allowed." });
    }

    const { id } = req.query;

    const owner = 'macglencoe';
    const repo = 'EmporiumWebsite';
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ message: "Github token not found." });
    }

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${id}`;

    const issueResponse = await fetch(githubApiUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });

    const issueData = await issueResponse.json();

    if (issueResponse.ok) {
        return res.status(200).json(issueData);
    } else {
        return res.status(issueResponse.status).json({ error: issueData });
    }
}