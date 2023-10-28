const fs = require('fs');
var jsFile = [];

exports.registerFs = async function(directory) {
    await readFolder(directory);
    return jsFile
}

async function readFolder(directory) {
    for(const file of fs.readdirSync(directory, 'utf8')) {
        if(file.includes('embedList')) continue;
        if(file.includes('.js')) jsFile.push(`${directory}/${file}`);
        else readFolder(`${directory}/${file}`)
    }
}
