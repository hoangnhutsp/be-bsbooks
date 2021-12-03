import { rmSync } from "fs";

const constain = {
    search: "Tim kiem",
    product: "San pham",
}


export const breadcrumb = async (req, res) => {
    try {
        let arrPath = req.body.path.split('/');

        let breadcrumb = [];
        let path = '';
        
        if (e[1] === 'product'){
            console.log(e[2]);
        }


        res.status(200).json(arrPath)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
