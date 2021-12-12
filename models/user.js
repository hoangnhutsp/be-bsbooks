import mongoose from 'mongoose';
import fs from 'fs';
import { stringify } from 'querystring';
import jwt from 'jsonwebtoken';
import validator from 'validator';



const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    phone: String,
    email: {
        type: String,
        unique: true,
        require: true,
        validate: value => {
            if(!validator.isEmail(value))
                throw new Error({error: "Invalid email credentials "})
        }
    },
    password: {
        type: String,
    },
    address: String,
    gender: String,
    birthday: {
        type: Date,
        default: Date.now(),
    },
    avatar: {
        type: String,
        default: "https://be-bsbooks.herokuapp.com/default/images/default-avatar-profile.jpg",
    },
    role: {
        type: String,
        default: "USER",
    },
  
})


const User = mongoose.model('user', userSchema);

export default User;