import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session'
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

dotenv.config();

import { sessionMiddleware } from "./middlewares/session.middleware.js"

import cartRoutes from './routes/cart.js'
import productRoutes from './routes/product.js';
import userRouters from './routes/user.js'
import evaluateRouters from './routes/evaluate.js'
import categoryRoutes from './routes/category.js'
import invoiceRoutes from './routes/invoice.js'
import adminRouter from './routes/admin.js'
import notificationRouter from './routes/notification.js'
import testRouter from './routes/test.js'


import recentlyViewd from './routes/recently_viewed.js'
import uploadImageRoutes from './routes/upload_image.js'
import addressRoutes from './routes/address.js'
import jwt from 'jsonwebtoken';


const app = express();


const SECRET = process.env.SECRET;


var server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: "*",
    }
  });

app.use(express.static('./public'));
app.use('./middleware/upload', express.static('upload'));


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use(cors({credentials: true, origin: "*"}))

const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.URL_MONGODB;

const dbOptions = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
}

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: CONNECTION_URL }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}))


io.on('connection', socket => {
    socket.on('joinRoom', token => {
        const gettoken = token
        jwt.verify(gettoken, SECRET, (err, user) => {
            if(err) socket.emit('accept', {message: "wrong verify token"})
            else{
                let userId = user.id
                socket.join(userId);
            }
        })
    });
    socket.on('addNotification', async data => {
        const token = data.token;
        try {
            jwt.verify(token, SECRET, (err, user) => {
                if (!err) {
                    const title = data.title;
                    const description = data.description;
                    const id_user = data.id_user;
                    const image = data.image;
                    const _id = data._id;
                    io.to(id_user).emit('ServerSendNotification', {image, title, description, _id})
                };
            })
        } catch (error) {
            
        }
        
    })

    socket.on('disconnect', ()=>{
        console.log(socket.id + ' disconnect')
    })
})


app.use('/user', userRouters)
app.use('/cart', cartRoutes)
app.use('/evaluate', evaluateRouters)
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.use('/recently_viewd', recentlyViewd)
app.use('/upload_image', uploadImageRoutes);
app.use('/address', addressRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/admin', adminRouter);
app.use('/notification', notificationRouter);


app.get('/', (req, res) => {
    res.send('APP OKE :V')
})



mongoose.connect(CONNECTION_URL, dbOptions)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error.message)
});


