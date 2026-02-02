
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
