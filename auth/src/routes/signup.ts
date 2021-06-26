import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError } from '../middleware/errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middleware/validateRequest';
const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
],
    validateRequest,
    async (req: Request, res: Response) => {      
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('Email in use');
        }
        const user = User.build({ email, password });
        await user.save();
        if (!process.env.JWT_KEY) throw new Error('JWT not defined');
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY);
        req.session = {
            jwt: userJwt
        }
        res.status(201).send(user);
    });

export { router as signUpRouter }