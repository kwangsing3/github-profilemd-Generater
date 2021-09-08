//- File System write and read-//
const fs = require('fs');
const path = require('path');
const Logger = require('./logger');
async function WriteFile(targetpath = "", content, log = false) {
    return new Promise((resolve,reject) =>{
        fs.promises.mkdir(path.dirname(targetpath), {recursive: true}).then(
            ()=>{
                fs.writeFile(targetpath, content, function (err) {
                    if (err) {
                        throw err;
                    }
                    if (log)
                    Logger.info(`Genearted ${targetpath}`);
                    resolve();
                })
            }
        );
    });
}






module.exports.WriteFile = WriteFile;