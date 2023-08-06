import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACK || 8082;
const MOCK_DATA = {
  meta: {
    data: {
      title: 'Floema',
      description: 'a beautiful jewelry',
      image: '',
    },
  },
};

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.get('/', (req: express.Request, res : express.Response) => {
  res.render('pages/home', MOCK_DATA);
});

app.get('/about', (req: express.Request, res : express.Response) => {
  res.render('pages/about', MOCK_DATA);
});

app.get('/detail/:id', (req: express.Request, res : express.Response) => {
  res.render('pages/detail', MOCK_DATA);
});

app.get('/collections', (req: express.Request, res : express.Response) => {
  res.render('pages/collections', MOCK_DATA);
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
