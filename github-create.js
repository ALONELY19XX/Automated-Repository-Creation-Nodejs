#! /usr/bin/env node

'use strict'

const axios = require('axios')
const { ArgumentParser } = require('argparse')

const parser = new ArgumentParser({
    description: 'GitHub Repo Creation Automation'
})
parser.add_argument('-n', '--name', { help: 'Name of repository to be created'})
parser.add_argument('-i', '--init', { help: 'Create initial commit with README.md (Default: false)'})
parser.add_argument('-p', '--private', { help: 'Create private repository (Default: false)'})
parser.add_argument('-d', '--description', { help: 'Description of repository'})
parser.add_argument('-g', '--gitignore', { help: 'Name of gitignore template (Default: none)'})
parser.add_argument('-l', '--license', { help: 'License to use for this repository (Default: none)'})
const args = parser.parse_args()

const GITHUB_API_REQUEST_URL = 'https://api.github.com/user/repos'

axios.post(GITHUB_API_REQUEST_URL, {
    name: args.name,
    'auto_init': args.init,
    'private': args.private,
    'description': args.description,
    'gitignore_template': args.gitignore,
    'license_template': args.license
}, {
    headers: {
        'Authorization': `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
})
.then(response => {
    if (!response.isAxiosError) {
        console.log(`Successfully created repository "${args.name}".`)
        console.log('REPO >>> ' + response.data.html_url)
    }
})
.catch(error => {
    console.log(`[!] ${error.response.data.message} Server responded with: ${error.response.status} ${error.response.statusText}. Make sure a repository with this name doesn\'t already exist.`)
})