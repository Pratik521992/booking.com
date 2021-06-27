import express from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../middleware/errors/bad-request-error';
import { validateRequest } from '../middleware/validateRequest';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) throw new BadRequestError('Invalid username or password');
        const passwordMatch = await Password.compare(user.password, password);
        if(!passwordMatch) throw new BadRequestError('Invalid username or password');
        if (!process.env.JWT_KEY) throw new Error('JWT not defined');
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY);
        req.session = {
            jwt: userJwt
        }
        res.status(200).send(user);
    }
);

export { router as signinRouter };