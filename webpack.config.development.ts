import path from 'path';
import { merge } from 'webpack-merge';
import { HotModuleReplacementPlugin } from 'webpack';
import dotenv from 'dotenv';
import config from './webpack.config';

dotenv.config();

const PORT = process.env.PORT_WEBPACK || 3002;

const devConfig = {

  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    writeToDisk: true,
    port: PORT,
    hot: true,
    watchContentBase: true,
    proxy: {
      '/': `http://localhost:${process.env.PORT_BACK}`,
    },
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  plugins: [
    // ...other plugins...
    new HotModuleReplacementPlugin(),
  ],
};

export default merge([config, devConfig]);
