let path = require('path');
const fs = require('fs-extra');

const inquirer = require('inquirer');

const chalk = require('chalk'); 

const Creator = require('./Creator');

module.exports = async function (projectName, options) {
    const cwd = process.cwd();
    const targetDir = path.join(cwd, projectName);

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir);
        } else {
            let {action} = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: `Target directory already exists Pick an action:`,
                    choices: [
                        { name: 'Overwrite', value: 'overwrite' },
                        { name: 'Cancel', value: false  }
                    ]
                }
            ])
            if (!action) {
                return;
            } else if (action === 'overwrite') {
                console.log(`\r${chalk.cyan('Removing....')}`)
                await fs.remove(targetDir);
            }
        }
    }

    const creator = new Creator(projectName, targetDir);
    creator.create();
}