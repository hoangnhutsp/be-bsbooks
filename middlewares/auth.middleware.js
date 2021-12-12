import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const SECRET = process.env.SECRET

const Auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.sendStatus(400);
        jwt.verify(token, SECRET, (err, user) => {
            if (err) return res.status(401).json({message: 'WR: Verify Token'}); else
            {   
                req.userID = user.id;
                next();
            } 
        })
        
    } catch (error) {
        res.sendStatus(400);
    }
}
export default Auth;