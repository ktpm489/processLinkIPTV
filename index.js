const fs = require("fs-extra");
let normalList=['Arab','Asia','Europe','Latin_America']
let exceptionList=['Edmw','php','Reserve','.git','node_modules', 'Africa']
let concatList = ['Entertainment', 'Sports','India']
let ignoreListFile=['LG1.m3u8','LG2.m3u8','test.m3u8','Chinese','Vietnam.m3u8']
let unnormalList = ['North_America']
let normalListFile=['Canada.m3u8']
let outputFolder = '/Users/mac/Documents/IPTV/Output'
/***
 * 
 * 
 * 
 * const concat = require('concat');

try {
    concat(['input1/text1.txt', 'input2/text2.txt'], 'output/output.txt').then(result => console.log(result))
}catch (e) {
    console.log('Ex',e)
}
*/
async function getDirectories(path) {
    let filesAndDirectories = await fs.readdir(path);

    // let directories = [];
    await Promise.all(
        filesAndDirectories.map(name => {
            return fs.stat(path + name)
                .then(stat => {
                    if (stat.isDirectory()) 
                    {
                        // console.log('name Folder', name)
                        // directories.push(name)
                        // getDirectories(path + name)
                        readDir(path + name)
                        // console.log('directories', readDir(path + name))
                    } else 
                    if (stat.isFile() && name.indexOf('m3u') !== -1){
                       
                        if ( calculateFile(name) !== 2) {
                            console.log('concat([' + ["'" + path + name + "'"] + '],', "'" + outputFolder + '/' + 'Normal ' + name + "'" + ')')
                        }
                       
                    }
                })
        })
    );
    // return directories;
}

function readDir(folderName, isCustom = false) {
     // xu ly truong hop rieng ve Chinses nam trong Asia -> them bien isCustom de auto add vo
    let output = []
    fs.readdir(folderName, (err, files) => {
        let lastName = folderName.substring(folderName.lastIndexOf('/') + 1)
        let currentType = calculateType(folderName)
        if (currentType === 3 || isCustom) {
            files.forEach(file => {
                output.push("'" + folderName + '/' + file + "'")
            });
            console.log('concat([' + output + '],', "'" + outputFolder + '/' + 'Normal ' + lastName + '.m3u8' + "'"  + ')')
        } else if (currentType === 1){
            files.forEach(file => {
                if (!isCustom && calculateFile(file) !== 2 || isCustom) {
                    console.log('concat([' + ["'" + folderName + '/' + file + "'"] + '],', "'" + outputFolder + '/' + 'Normal ' + file + "'" + ')')
                }
                
            });
        } else if (currentType === 4) {
            files.forEach(file => {
                if (calculateFile(file) === 3) {
                 console.log('concat([' + ["'" + folderName + '/' + file + "'"] + '],', "'" + outputFolder + '/' + 'Normal ' + file + "'" + ')')
               }
               else if (calculateFile(file) !== 2) {
                   // add chung vo 1 file
                   output.push("'" + folderName + '/' + file + "'")
                }

            });
            console.log('concat([' + output + '],', "'" + outputFolder + '/' + 'Normal ' + lastName + '.m3u8' + "'" + ')')
        }
    })
    
}

// tinh toan cho thu muc duoc render
function calculateType(folderName) {
    let lastName = folderName.substring(folderName.lastIndexOf('/') + 1)
    // file bt luu truc tiep vo ten thu muc moi
    // load 1 luu bt 
    // load 2 exception
    // load 3 luu chung 1 file
    // loai 4 vua chua loai can luu chung 1 file, va loai binh thuong
    if (normalList.includes(lastName)){
        return 1
    } else if (exceptionList.includes(lastName)) {
        return 2
    } else if (concatList.includes(lastName)){
        return 3
    } else if (unnormalList.includes(lastName)){
        return 4
    }
    return 1

}

// tinh toan file render
function calculateFile(fileName) {
    // loai 2 -> ignore, loai 1 -> luu, loai 3 la luu binh thuong trong thu muc vua chua file can luu chung, file can luu rieng
    if (ignoreListFile.includes(fileName)){
        return 2
    } else if (normalListFile.includes(fileName)){
        // file nay luu rieng dua vao chinh ten no
        return 3
    }
    return 1
}
async function data() {
    await getDirectories("/Users/mac/Documents/IPTV/")
    await readDir("/Users/mac/Documents/IPTV/Asia/Chinese", true)
    // console.log('directories', directories)
}

data()
