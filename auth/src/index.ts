import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import { signUpRouter } from './signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './middleware/errors/not-found-error';

const app = express();
app.use(json());

app.use(signUpRouter);
app.all('*', async () => {
    throw new NotFoundError();
})

app.use(errorHandler);

app.listen(3000, () => {
    console.log('listning to PORT: 3000');
})