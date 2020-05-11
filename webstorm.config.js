'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      '@api': resolve('src/api'),
      '@busi': resolve('src/busi'),
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils')
    }
  }
}
