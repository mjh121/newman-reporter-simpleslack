const fs = require('fs');
const path = require('path');

const imgLinkPath = path.join(__dirname, '../assets/imageLink.json');
const imgLinkJsonFile = fs.readFileSync(imgLinkPath);
const imgLinkJson = JSON.parse(imgLinkJsonFile);

function getImgLink(state, dayNumber) {
    return imgLinkJson[state]['d'+dayNumber];
}

exports.ImgUtils = { getImgLink }