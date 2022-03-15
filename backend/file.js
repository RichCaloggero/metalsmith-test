const fs = require("fs")
const path = require("path")

function getAllFiles  (dirPath, list = []) {
const files = fs.readdirSync(dirPath);

files.forEach(file => {
const _file = dirPath + "/" + file;
if (fs.statSync(_file).isDirectory()) {
list = getAllFiles(_file, list);
} else {
list.push(
path.join(dirPath, "/", file));
} // if
}); // forEach

return list;
} // getAllFiles

/// exports

module.exports = {getAllFiles};

