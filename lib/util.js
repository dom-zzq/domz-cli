const ora = require('ora');


// 命令行中的loading效果
async function warpLoading (fn, message, ...args) {
    const spinner = ora(message);
    
    spinner.start(); // 开启加载Loading
    try {
        let repos = await fn(...args);
        spinner.succeed(); // 成功
        return repos;
    } catch (e) {
        spinner.fail('request failed, refetch...') // 失败了，重新加载...
        await sleep(1000);
        return warpLoading(fn, message, ...args);
    }
}

async function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, n);
    })
}

module.exports = {
    warpLoading,
    sleep
}