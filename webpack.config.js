const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './client/index.html',
    })
  ],
  devServer: {
    // historyApiFallback: true, 
    static: {
      publicPath: '/',
      directory: path.resolve(__dirname, 'dist'),
    },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    // },
    // port:8080,
    proxy: {
      '/users': 'http://localhost:3000',
      '/graphql': 'http://localhost:3000',
    },
    hot: true, 
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  resolve: {
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['', '.js', '.jsx'],
  },
};
