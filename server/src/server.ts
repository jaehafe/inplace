import express, { Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

import { AppDataSource } from './data-source';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import postVoteRoutes from './routes/postVotes';
import commentVoteRoutes from './routes/commentVotes';
import followRoutes from './routes/follows';
import categoryRoutes from './routes/categories';
import imageRoutes from './routes/images';

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
app.use('/api/image', imageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/postVotes', postVoteRoutes);
app.use('/api/commentVotes', commentVoteRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/categories', categoryRoutes);

let port = 4000;

app.listen(port, async () => {
  console.log(`Server is running at ${process.env.ORIGIN}`);

  try {
    await AppDataSource.initialize();
    console.log('database initialized!!!');
  } catch (error) {
    console.error(error);
  }
});
