import path from 'path';
import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import prismicH from '@prismicio/helpers';
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import client from './config/prismicConfig';
import { AboutData } from './model/about.type';
import { MetaData } from './model/metadata.type';
import { Home } from './model/home.type';
import DocumentType from './model/documentType.type';
import { Product } from './model/product.type';
import { DataCollection } from './model/collection.type';
import { handleLinkResolver, numberToWords } from './helper/utils';
import { DataPreloader } from './model/preloader.type';
import { Navigation } from './model/navigation.type';

// ---------------BASE CONFIG
dotenv.config();
const app = express();
const PORT = process.env.PORT_BACK || 8082;

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// ---------------MIDDLEWARES
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(errorHandler());

app.use('/main.css', createProxyMiddleware({
  target: `http://localhost:${process.env.PORT_WEBPACK}`,
  changeOrigin: true,
}));

app.use((req: express.Request, res : express.Response, next : NextFunction) => {
  res.locals.prismicDom = prismicH;
  res.locals.numToWord = numberToWords;
  res.locals.Link = handleLinkResolver;
  next();
});

app.use(async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    const meta = await client.getSingle('metadata');
    const preloader = await client.getSingle('preloader');
    const navigation = await client.getSingle('navigation');

    if (meta.data && preloader.data && navigation.data) {
      const metadata = meta.data as MetaData;
      const preloaderData = preloader.data as DataPreloader;
      const navigationData = navigation.data as Navigation;
      res.locals.meta = metadata;
      res.locals.preloader = preloaderData;
      res.locals.navigation = navigationData;
    } else {
      throw new Error('no data found');
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching common data');
  }
});

// ---------------ROUTES
app.get('/', async (req: express.Request, res : express.Response) => {
  try {
    const documentCollections = await client.getAllByType('collection', {
      fetchLinks: [
        'product.image',
        'product.title',
        'product.collection',
      ],
    });
    const document = await client.getSingle('home');

    if (document.data && documentCollections && documentCollections.length) {
      const collections = documentCollections.map(
        (collection) => collection.data,
      ) as DataCollection[];
      const home = document.data as Home;
      res.render('pages/home', { home, collections });
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

    if (document.data) {
      const about = document.data as AboutData;
      res.render('pages/about', { about });
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

    if (document.data) {
      const product = document.data as Product;
      res.render('pages/detail', { product });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/collections', async (req: express.Request, res : express.Response) => {
  try {
    const document = await client.getAllByType('collection', {
      fetchLinks: [
        'product.image',
        'product.title',
        'product.collection',
      ],
    });

    if (document && document.length) {
      const collections = document.map((collection) => collection.data) as DataCollection[];
      res.render('pages/collections', { collections });
    } else {
      throw new Error('no data found');
    }
  } catch (error) {
    console.error(error);
  }
});

app.get('/test', async (req: express.Request, res : express.Response) => {
  try {
    const navigation = await client.getSingle('navigation');
    res.send(navigation.data);
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
