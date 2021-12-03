import mongoose from 'mongoose';
import fs from 'fs';
import { nanoid } from 'nanoid'



const DEFAULT_FOLDER_UPLOAD_IMAGE = './public/upload/images'
const DEFAULT_SIZE_ID_IMAGE = 20;
const URL_HOST = 'http://localhost:5000/';


const mkdirUploadImage = () => {
    console.log(`LOG: make default folder upload image`);
    const folder = DEFAULT_FOLDER_UPLOAD_IMAGE.split('/');

    let path = '.'
    for (let i = 1; i < folder.length; i++){
        path = path + '/' + folder[i];
        if (!fs.existsSync(path)){
            fs.mkdirSync(path)
        }
    }
}

const solvePathURL =  path => {
    let new_path = path.split('/').slice(2).join('/');
    let full_path = URL_HOST + new_path;

    return full_path;
}

const saveImage = (folder, nameImg, base64Data) => {
    const ext = base64Data.substring(base64Data.indexOf("/") + 1, base64Data.indexOf(";base64"));
    const base64_replace = base64Data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    const path = folder + '/' + nameImg + '.' + ext;

    fs.writeFileSync(path, base64_replace, 'base64');

    const full_path = solvePathURL(path);
    return full_path;
}

export const uploadImage = async (req, res) => {
    try {

        if (!fs.existsSync(DEFAULT_FOLDER_UPLOAD_IMAGE)){
            mkdirUploadImage();
        }
        
        const images = req.body.images;

        let path_images = [];
        images.forEach(image => {
            let id_image = nanoid(DEFAULT_SIZE_ID_IMAGE);
            let date = Date.parse(new Date());

            let nameImg = id_image + date;
            let path = saveImage(DEFAULT_FOLDER_UPLOAD_IMAGE, nameImg, image);
            path_images.push(path)
        });
        //saveImage(DEFAULT_FOLDER_UPLOAD_IMAGE, name, images[0]);
        
        res.status(200).json({status: "success", path_images});

    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

