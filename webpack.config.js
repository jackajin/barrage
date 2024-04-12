const path = require('path')
module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: './src/index.ts',  // 要打包的入口文件
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'amd',
    // clear: true,
  },
};