import express from 'express'
const app = express()
const port = process.env.PORT;
app.listen(port, () => console.log(`app is listening to port ${port}`));

import { db } from './database/index.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import schoolRouter from './routes/school.js'

app.use('/',schoolRouter)

import notFound from './middleware/notFound.js'

app.use(notFound)

import errorHandler from './middleware/expressError.js'

app.use(errorHandler)