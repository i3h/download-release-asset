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
    token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## Features

1.  Support private repository

    If \<token\> is provided, you will be able to download assets from a private
    repository.

    Please create your personal access token by following instructions of GitHub.

2.  Support file name regex

    If input variable \<file\> starts with '/' and ends with '/',
    it will be treated as user input regex. (e.g /[a-zA-Z]+.txt/)

    If \<file\> does not contain '/', we will construct a regex
    exactly matching \<file\>.

    All of matched assets will be downloaded.
