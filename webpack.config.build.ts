import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import config from './webpack.config';

const buildConfig : Configuration = {
  mode: 'production',

  output: {
    path: path.join(__dirname, 'dist'),
  },

  plugins: [
    new CleanWebpackPlugin(),
  ],
};
export default merge([config, buildConfig]);
