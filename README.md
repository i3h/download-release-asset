# GitHub Action - Download Release Asset

This GitHub Action helps download release asset from a private repository with personal access token.

## Usage

```
- name: Download Release Asset
  id: download_release_asset
  uses: i3h/download-release-asset@v1
  with:
    owner: owner_of_repo
    repo: repo_name
    tag: tag_or_latest
    file: file_name
    path: path_to_save_files
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## Features

#### Support private repository

If `token` is provided, you will be able to download assets from a private
repository.

Please create your personal access token by following instructions of GitHub.

#### Support file name regex

If input variable `file` starts and ends with `/`,
it will be treated as regex. (e.g `/[a-zA-Z]+.txt/`)

All of matched assets will be downloaded.
