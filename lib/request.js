// 通过axios，来请求
// axios 可前端，可node
const axios = require('axios');

axios.interceptors.response.use(res => {
    return res.data;
})

async function fetchRepoList () {
    return axios.get(`https://api.github.com/orgs/domz-cli/repos`)
}

// 获取仓库中的 版本标签tag
async function fetchTagList (repo) {
    return axios.get(`https://api.github.com/repos/domz-cli/${repo}/tags`)
}

module.exports = {
    fetchRepoList,
    fetchTagList
}