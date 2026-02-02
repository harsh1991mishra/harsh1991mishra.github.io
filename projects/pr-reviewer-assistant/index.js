
// Starter example using @octokit/rest
// npm install @octokit/rest
const {{ Octokit }} = require("@octokit/rest");

async function listRepos(token) {{
  const octokit = new Octokit({ auth: token });
  const res = await octokit.rest.repos.listForAuthenticatedUser();
  res.data.forEach(r => console.log(r.full_name));
}

if (require.main === module) {{
  const token = process.env.GITHUB_TOKEN;
  if (!token) {{
    console.log('Set GITHUB_TOKEN');
    process.exit(1);
  }}
  listRepos(token);
}}
