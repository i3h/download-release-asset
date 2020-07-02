const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const axios = require('axios').default;

async function run() {
  try {
    const api = 'https://api.github.com';
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const tag = core.getInput('tag');
    const file = core.getInput('file');
    const token = core.getInput('token');

    // Get release
    let url;
    if (tag == 'latest') {
      url = api + '/repos/' + owner + '/' + repo + '/releases/latest';
    } else {
      url = api + '/repos/' + owner + '/' + repo + '/releases/tags/' + tag;
    }

    let headers = {
      Accept: 'application/json',
    };
    if (token != '') {
      headers.Authorization = 'token ' + token;
    }

    let resp = await axios({
      method: 'get',
      url: url,
      headers: headers,
    });
    let js = resp.data;

    // Construct regex
    let re;
    if (file[0] == '/' && file[file.length - 1] == '/') {
      re = new RegExp(file.substr(1, file.length - 2));
    } else {
      re = new RegExp('^' + file + '$');
    }

    // Get assets
    let assets = [];
    for (let a of js.assets) {
      if (re.test(a.name)) {
        assets.push(a);
      }
    }

    // Download assets
    headers = {
      Accept: 'application/octet-stream',
    };
    if (token != '') {
      headers.Authorization = 'token ' + token;
    }
    for (let a of assets) {
      axios({
        method: 'get',
        url: a.url,
        headers: headers,
        responseType: 'stream',
      }).then(resp => {
        resp.data.pipe(fs.createWriteStream(a.name));
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
