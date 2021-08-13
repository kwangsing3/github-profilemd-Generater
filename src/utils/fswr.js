//- File System write and read-//
const fs = require('fs');
const path = require('path');

async function WriteFile(targetpath = "" , content = "" , SucessCallback, FailedCallback) {
    return new Promise((resolve,reject) =>{
        fs.promises.mkdir(path.dirname(targetpath), {recursive: true}).then(
            ()=>{
                fs.writeFile(targetpath, content, function (err) {
                    if (err) 
                        reject(FailedCallback(err));
                    resolve(SucessCallback());
                })
            }
        );
    }).catch((error)=>{
        console.error(error);
    });
}


async function ClearFolder(path = "" , SucessCallback, FailedCallback) {
    return new Promise((resolve,reject) =>{
        fs.rmdir(path,{ recursive: true }, function (err) {
            if (err) 
                reject(FailedCallback(err));
            resolve(SucessCallback());
        });
    }).catch(()=>{
        console.error("Clear unexpected failed");
    });
}

async function CopyFile(pathA = "" , pathB = "" ,SucessCallback, FailedCallback) {
    return new Promise((resolve,reject) =>{
        fs.promises.mkdir(path.dirname(pathB), {recursive: true}).then(
            ()=>{
                fs.copyFile(pathA, pathB, function (err){
                    if (err) 
                        reject(FailedCallback(err));
                    resolve(SucessCallback());
                });
            }
        );
    }).catch(()=>{
        console.error("Copy unexpected failed");
    });
}



module.exports.WriteFile = WriteFile;
module.exports.ClearFolder = ClearFolder;
module.exports.CopyFile = CopyFile