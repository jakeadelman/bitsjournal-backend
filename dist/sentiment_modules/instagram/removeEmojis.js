"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emojiTree = require("emoji-tree");
exports.removeEmojis = baseStr => {
    return new Promise(resolve => {
        let fullObj = emojiTree(baseStr);
        mapObj(fullObj).then(r => {
            resolve(r);
        });
    });
};
const mapObj = fullObj => {
    return new Promise(resolve => {
        let endStr = "";
        for (let i = 0; i < fullObj.length; i++) {
            let plus1i = i + 1;
            if (fullObj[i].type == "text") {
                endStr += fullObj[i].text;
                if (plus1i == fullObj.length) {
                    resolve(endStr);
                }
            }
            else {
                if (plus1i == fullObj.length) {
                    resolve(endStr);
                }
            }
        }
    });
};
exports.removeEmojis("hello there homoe").then(r => {
    console.log(r);
});
//# sourceMappingURL=removeEmojis.js.map