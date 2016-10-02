var path = require('path');

module.exports = {  
  entry: ['./src/app/app.js'],
  output: {
    path: __dirname + "/dist/scripts",
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
}