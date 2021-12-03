import mongoose from 'mongoose';
import Session from '../models/session.js';
export const sessionMiddleware = async (req, res, next) => {
    console.log(`LOG: Session ID - ${req.sessionID}`);
    console.log(`${req.method}: ${req.path}`);
    next()
}