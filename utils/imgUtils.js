const fs = require('fs');
const path = require('path');

let imgLinkJsonFile;
let imgLinkJson;

class ImgUtils {
    constructor(filePath) {
        imgLinkJsonFile = fs.readFileSync(filePath);
        imgLinkJson = JSON.parse(imgLinkJsonFile);
    }

    getImgLink(state, dayNumber) {
        return imgLinkJson[state]['d'+dayNumber];
    }
}



exports.ImgUtils = ImgUtils;