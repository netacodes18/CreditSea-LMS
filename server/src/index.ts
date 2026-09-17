import dotenv from 'dotenv';
import { createApp } from './app';
import { connectDB } from './config/db';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = createApp();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
