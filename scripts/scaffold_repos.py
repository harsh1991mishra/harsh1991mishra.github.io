import os
from textwrap import dedent

BASE = os.path.join(os.getcwd(), 'projects')
REPOS = [
    ('automated-compliance-reporter', 'python'),
    ('ci-cd-workflow-enhancer', 'github-action'),
    ('env-var-sync-tool', 'python'),
    ('iot-device-status-dashboard', 'node'),
    ('firmware-release-manager', 'python'),
    ('home-automation-config-sync', 'node'),
    ('github-issue-bot', 'python'),
    ('pr-reviewer-assistant', 'node'),
    ('repo-health-monitor', 'python'),
    ('secret-scanner-integration', 'python'),
    ('audit-trail-generator', 'python'),
    ('encrypted-backup-sync', 'python'),
]

LICENSE = dedent('''
    MIT License

    Copyright (c) 2026 Harsh Mishra

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
''')

GITIGNORE_PY = dedent('''
    __pycache__/
    *.pyc
    .venv/
    .env
''')

GITIGNORE_NODE = dedent('''
    node_modules/
    dist/
    .env
''')

README_TPL = '''# {title}

{overview}

## Key Features
{features}

## How it uses the GitHub API
{api_usage}

## Example usage
{example}
'''

STARTER_PY = dedent('''
    """
    Starter example demonstrating a minimal GitHub API call using PyGithub.
    Ensure `PyGithub` is installed: pip install PyGithub
    """
    from github import Github
    import os

    def list_repos(token=None):
        token = token or os.getenv('GITHUB_TOKEN')
        if not token:
            print('Set GITHUB_TOKEN environment variable to run')
            return
        g = Github(token)
        user = g.get_user()
        for repo in user.get_repos():
            print(repo.full_name)

    if __name__ == '__main__':
        list_repos()
''')

STARTER_NODE = dedent('''
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
''')

ACTION_YML = dedent('''
    name: CI
    on: [push, pull_request]
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - name: Set up Python
            uses: actions/setup-python@v4
            with:
              python-version: '3.x'
          - name: Install
            run: pip install -r requirements.txt || true
          - name: Run tests
            run: echo "Add tests here"
''')


def ensure(path):
    os.makedirs(path, exist_ok=True)


def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


for name, lang in REPOS:
    repo_dir = os.path.join(BASE, name)
    ensure(repo_dir)

    # README content per project idea
    overview = f"{name.replace('-', ' ').title()} is a starter project demonstrating GitHub API integration for {name}."
    features = "- Starter code\n- Example API usage\n- Basic README and license"
    api_usage = "Uses the GitHub REST API to list or modify repositories, issues, or secrets depending on the project."
    example = "See the starter script in the repository for a runnable example."

    readme = README_TPL.format(title=name, overview=overview, features=features, api_usage=api_usage, example=example)
    write(os.path.join(repo_dir, 'README.md'), readme)
    write(os.path.join(repo_dir, 'LICENSE'), LICENSE)

    if lang == 'python':
        write(os.path.join(repo_dir, '.gitignore'), GITIGNORE_PY)
        write(os.path.join(repo_dir, 'requirements.txt'), 'PyGithub\n')
        write(os.path.join(repo_dir, 'example.py'), STARTER_PY)
    elif lang == 'node':
        write(os.path.join(repo_dir, '.gitignore'), GITIGNORE_NODE)
        write(os.path.join(repo_dir, 'package.json'), dedent(f"""
            {{
              "name": "{name}",
              "version": "0.1.0",
              "main": "index.js",
              "license": "MIT",
              "dependencies": {{
                "@octokit/rest": "^19.0.0"
              }}
            }}
        """))
        write(os.path.join(repo_dir, 'index.js'), STARTER_NODE)
    elif lang == 'github-action':
        ensure(os.path.join(repo_dir, '.github', 'workflows'))
        write(os.path.join(repo_dir, '.gitignore'), '# no files')
        write(os.path.join(repo_dir, '.github', 'workflows', 'ci.yml'), ACTION_YML)
        write(os.path.join(repo_dir, 'README.md'), readme + '\n\nThis repo contains a starter GitHub Action workflow.')

    # create a simple README badge placeholder line
    with open(os.path.join(repo_dir, 'README.md'), 'a', encoding='utf-8') as f:
        f.write('\n---\n')
        f.write('\n[License](LICENSE)')

print('Scaffold complete: created', len(REPOS), 'project folders under', BASE)
''