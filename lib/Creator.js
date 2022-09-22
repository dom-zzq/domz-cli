const { fetchRepoList, fetchTagList } = require("./request");

const inquirer = require('inquirer');

let downloadGitRepo = require('download-git-repo');


const util = require('util')
const path = require('path')

const { warpLoading } = require('./util');


class Creator {
    constructor (projectName, targetDir) {
        this.name = projectName;
        this.target = targetDir;

        this.downloadGitRepo = util.promisify(downloadGitRepo); // util.promisify 将普通函数转为promise
        console.log('offsetPath', process.cwd())
    }

    async create () {
        let repo = await this.fetchRepo();
        let tags = await this.fetchTag(repo)
        await this.download(repo, tags);
    }
    
    async fetchRepo () {
        // 当请求Repo失败时，重新再拉取
        let repos = await warpLoading(fetchRepoList, 'wating fetch template');
        if (!repos) return;
        repos = repos.map(item => item.name);

        let {repo} = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            message: `please choose a template to create project`,
            choices: repos
        })
        return repo;
    }

    async fetchTag (repo) {
        let tags = await warpLoading(fetchTagList, 'waiting fetch tag...', repo);
        if (!tags) return;
        tags = tags.map(item => item.name);

        let {tag} = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            message: `please choose a tag to create project`,
            choices: tags
        })
        return tag;
    }

    async download (repo, tag) {
        let requestUrl = `zhu-cli/${repo}${tag ? '#' + tag : ''}`
        await warpLoading(this.downloadGitRepo, 'wating for download the repo...', requestUrl, path.resolve(process.cwd(), this.name)) // `${repo}@${tag}`

        return this.target;
    }
}

module.exports = Creator;