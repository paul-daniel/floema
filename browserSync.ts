import dotenv from 'dotenv';
import browserSync from 'browser-sync';

dotenv.config();

const PORT = process.env.PORT_BACK || 3000;
const PORT_PROXY = process.env.PORT_PROXY || 5002;

browserSync({
  proxy: `http://localhost:${PORT}`,
  files: ['views/**/*.pug'],
  port: PORT_PROXY as number,
});
