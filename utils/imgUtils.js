const fs = require('fs');
const path = require('path');

let imgLinkJsonFile;
let imgLinkJson;

function init(filePath) {
    imgLinkJsonFile = fs.readFileSync(filePath);
    imgLinkJson = JSON.parse(imgLinkJsonFile);
}

function getImgLink(state, dayNumber) {
    return imgLinkJson[state]['d'+dayNumber];
}

exports.ImgUtils = { init, getImgLink }