import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACK || 8082;

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.get('/', (req: express.Request, res : express.Response) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
