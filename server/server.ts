import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import client from './config/prismicConfig';

// Assuming your Webpack dev server is running on port 8080

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

app.use('/main.css', createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_WEBPACK}`,
  changeOrigin: true,
}));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.get('/', (req: express.Request, res : express.Response) => {
  res.render('pages/home', MOCK_DATA);
});

app.get('/about', async (req: express.Request, res : express.Response) => {
  const document = await client.getSingle('about');
  console.log({ document });
  res.render('pages/about', { ...MOCK_DATA, document });
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
