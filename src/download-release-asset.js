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

    /*
     * If input variable <file> starts with '/' and ends with '/',
     * it will be treated as user input regex. (e.g /[a-zA-Z]+.txt/)
     *
     * If <file> does not contain '/', we will construct a regex
     * exactly matching <file>.
     *
     * All of matched assets will be downloaded.
     */

    // Get release
    let url;
    if (tag == 'latest') {
      url = api + '/repos/' + owner + '/' + repo + '/releases/latest';
    } else {
      url = api + '/repos/' + owner + '/' + repo + '/releases/tags/' + tag;
    }

    let headers = {
      Accept: 'application/json',
      'User-Agent': 'request',
    };
    if (token != '') {
      headers.Authorization = 'token ' + token;
    }

    //console.log(url);
    let resp = await request({
      url: url,
      headers: headers,
    });
    let js = JSON.parse(resp);
    //console.log(js);

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
    //console.log(assets);

    // Download assets
    headers = {
      Accept: 'application/octet-stream',
      'User-Agent': 'request',
    };
    if (token != '') {
      headers.Authorization = 'token ' + token;
    }
    for (let a of assets) {
      request({
        url: a.url,
        headers: headers,
      }).pipe(fs.createWriteStream(a.name));
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
