const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const request = require('request-promise');

async function run() {
  try {
    const api = 'https://api.github.com';
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const tag = core.getInput('tag');
    const file = core.getInput('file');
    const token = core.getInput('token');

    let url, resp, headers, js, assets, asset;

    // Get release
    if (tag == 'latest') {
      url = api + '/repos/' + owner + '/' + repo + '/releases/latest';
    } else {
      url = api + '/repos/' + owner + '/' + repo + '/releases/tags/' + tag;
    }
    if (token == '') {
      headers = {
        Accept: 'application/json',
        'User-Agent': 'request',
      };
    } else {
      headers = {
        Authorization: 'token ' + token,
        Accept: 'application/json',
        'User-Agent': 'request',
      };
    }
    //console.log(url);
    resp = await request({
      url: url,
      headers: headers,
    });
    js = JSON.parse(resp);
    //console.log(js);

    // Get asset
    assets = js.assets;
    for (let a of assets) {
      if (a.name == file) {
        asset = a;
        break;
      }
    }
    //console.log(asset);

    // Download asset
    if (token == '') {
      headers = {
        Accept: 'application/octet-stream',
        'User-Agent': 'request',
      };
    } else {
      headers = {
        Authorization: 'token ' + token,
        Accept: 'application/octet-stream',
        'User-Agent': 'request',
      };
    }
    request({
      url: asset.url,
      headers: headers,
    }).pipe(fs.createWriteStream(asset.name));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
