import express, { Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';

import authRoutes from './routes/auth';

dotenv.config();
const app = express();
// const origin = 'http://localhost:3000';
const origin = process.env.ORIGIN;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin, credentials: true }));

dotenv.config();

app.get('/', (_, res: Response) => {
  res.send('server is running!!!');
});
app.use('/api/auth', authRoutes);

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
