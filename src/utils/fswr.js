//- File System write and read-//
const fs = require('fs');
const path = require('path');

async function WriteFile(targetpath = "", content, log = false) {
    return new Promise((resolve,reject) =>{
        fs.promises.mkdir(path.dirname(targetpath), {recursive: true}).then(
            ()=>{
                fs.writeFile(targetpath, content, function (err) {
                    if (err) {
                        throw err;
                    }
                    if (log)
                        console.log(`Genearted ${targetpath}`);
                    resolve();
                })
            }
        );
    });
}






module.exports.WriteFile = WriteFile;