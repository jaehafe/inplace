import express, { Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth';

const app = express();
const origin = 'http://localhost:3000';

app.use(express.json());
app.use(morgan('dev'));
app.use(
  cors({
    origin,
  })
);

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
