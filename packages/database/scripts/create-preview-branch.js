import './environment.js';

const apiKey = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
const requestedName = process.argv[2] ?? `preview-${Date.now()}`;

if (!apiKey || !projectId) {
  throw new Error('NEON_API_KEY and NEON_PROJECT_ID are required');
}

if (!/^[a-z0-9][a-z0-9-]{0,62}$/u.test(requestedName)) {
  throw new Error('Preview branch names must use lowercase letters, numbers, and hyphens');
}

const branch = { name: requestedName };

if (process.env.NEON_PARENT_BRANCH_ID) {
  branch.parent_id = process.env.NEON_PARENT_BRANCH_ID;
}

const response = await fetch(
  `https://console.neon.tech/api/v2/projects/${encodeURIComponent(projectId)}/branches`,
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      branch,
      endpoints: [{ type: 'read_write' }],
    }),
  },
);

const result = await response.json();

if (!response.ok) {
  throw new Error(
    `Neon branch creation failed (${response.status}): ${result.message ?? 'unknown error'}`,
  );
}

console.log(
  JSON.stringify(
    {
      branchId: result.branch.id,
      branchName: result.branch.name,
      endpointId: result.endpoints?.[0]?.id ?? null,
    },
    null,
    2,
  ),
);
