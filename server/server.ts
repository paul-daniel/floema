import path from 'path';
import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import prismicH from '@prismicio/helpers';
import client from './config/prismicConfig';
import { AboutData } from './model/about.type';
import { MetaData } from './model/metadata.type';
import { Home } from './model/home.type';
import DocumentType from './model/documentType.type';
import { Product } from './model/product.type';
// BASE CONFIG
dotenv.config();
const app = express();
const PORT = process.env.PORT_BACK || 8082;

// PROXY WITH WEBPACK
app.use('/main.css', createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_WEBPACK}`,
  changeOrigin: true,
}));

app.use((req: express.Request, res : express.Response, next : NextFunction) => {
  res.locals.prismicDom = prismicH;
  next();
});

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// ENDPOINTS
app.get('/', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getSingle('home');
    const meta = await client.getSingle('metadata');

    if (document.data && meta.data) {
      const data = document.data as Home;
      const metadata = meta.data as MetaData;
      res.render('pages/home', { meta: metadata, home: data });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/about', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getSingle('about');
    const meta = await client.getSingle('metadata');

    if (document.data && meta.data) {
      const data = document.data as AboutData;
      const metadata = meta.data as MetaData;
      res.render('pages/about', { meta: metadata, about: data });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/detail/:uid', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getByUID(DocumentType.PRODUCT, req.params.uid, {
      fetchLinks: [
        'collection.title',
      ],
    });
    const meta = await client.getSingle('metadata');

    if (document.data && meta.data) {
      const data = document.data as Product;
      const metadata = meta.data as MetaData;
      res.render('pages/detail', { meta: metadata, product: data });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/collections', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getSingle('about');
    const meta = await client.getSingle('metadata');

    if (document.data && meta.data) {
      const data = document.data as AboutData;
      const metadata = meta.data as MetaData;
      res.render('pages/collections', { meta: metadata, about: data });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/test/:uid', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getByUID(DocumentType.PRODUCT, req.params.uid, {
      fetchLinks: [
        'collection.title',
      ],
    });
    res.send(document.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
