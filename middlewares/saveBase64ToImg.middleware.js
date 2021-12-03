import fs from 'fs';

const saveBase64ToImg = (folder, nameImg, base64Data) => {
    if (!fs.existsSync(folder))
        fs.mkdirSync(folder);
    const ext = base64Data.substring(base64Data.indexOf("/") + 1, base64Data.indexOf(";base64"));
    const base64_replace = base64Data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const path_avatar = folder + '/' + nameImg + '.' + ext;
    fs.writeFileSync(path_avatar, base64_replace, 'base64');
}

export default saveBase64ToImg;