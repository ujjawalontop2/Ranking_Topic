import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import {
    errorMessage, status,
} from '../helpers/status.js';

dotenv.config();

const verifyToken = async (req, res, next) => {
    //Header Payload Signature --> jwt

    const { token } = req.headers; //while login we and sign using jwt and it automatically goes in headers
    
    if (!token) {
        errorMessage.error = 'Token not provided';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);//signature matched
        req.user = { //payload
            email: decoded.email,
            password: decoded.password
        };
        next();
    } catch (error) {
        errorMessage.error = 'Authentication Failed';
        return res.status(status.unauthorized).send(errorMessage);
    }
};



export default verifyToken;