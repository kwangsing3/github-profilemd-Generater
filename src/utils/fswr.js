//- File System write and read-//
const fs = require('fs');


async function WriteFile(path = "" , content , SucessCallback, FailedCallback) {
    return new Promise((resolve,reject) =>{
        fs.writeFile(path, content, function (err) {
            if (err) 
                reject(FailedCallback());
            resolve(SucessCallback());
        });
    }).catch((error)=>{
        console.error(error.message);
    });
}






module.exports.WriteFile = WriteFile;