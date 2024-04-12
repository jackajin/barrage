const path = require('path')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const processCwd = process.cwd()

const config = {
  entry: path.join(`${processCwd}/src`, 'index.tsx'),
  output: {
    path: path.join(`${processCwd}/src`, 'dist'),
    clean: true,
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.join(`${processCwd}/src`, '')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(`${processCwd}/`, 'index.html'),
    }),
  ],
  profile: true,
  module: {
    rules: [
        {
        test: /\.tsx$/,
        exclude: /(node_modules|dist)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/plugin-syntax-dynamic-import'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]-[hash:base64:5]-[local]',
              }
            }
          },
          {
            loader: 'sass-loader',
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: (module) => {
            const path = module.filename.split(sep)[2]
            return `${path}/assets/[name][ext]`
          },
        },
      },
    ]
  }
}

const compiler = webpack(config)
const server = new WebpackDevServer({
  port: 4003,
  host: '0.0.0.0',
  hot: true,
  compress: true,
  historyApiFallback: true
 }, compiler)

 server.startCallback(() => {
  console.log('Starting server on http://localhost:4003')
})

