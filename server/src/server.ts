import express, { Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import { AppDataSource } from './data-source';

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import postVoteRoutes from './routes/postVotes';

dotenv.config();
const app = express();
const origin = process.env.ORIGIN;

app.use(cors({ origin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
// app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('uploads'));

dotenv.config();

app.get('/', (_, res: Response) => {
  res.send('server is running!!!');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/postVotes', postVoteRoutes);

let port = 4000;

app.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);

  try {
    await AppDataSource.initialize();
    console.log('database initialized!!!');
  } catch (error) {
    console.error(error);
  }
});
