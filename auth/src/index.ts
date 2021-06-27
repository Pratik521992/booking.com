import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './middleware/errors/not-found-error';
import { signinRouter } from './routes/signin';
import { currentUserRouter } from './routes/currentuser';
import { signoutRouter } from './routes/signout';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: true }));
app.use(signUpRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);
app.all('*', async () => {
    throw new NotFoundError();
});
app.use(errorHandler);
const start = async () => {
    if (!process.env.JWT_KEY) throw new Error('JWT not defined');
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err)
    }
}
start();
app.listen(3000, () => {
    console.log('listning to PORT: 3000');
});