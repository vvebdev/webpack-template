const path = require('path');
const glob = require('glob');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config')

// ===============================================
const historyApiFallbackRewritesGenerator = () => {
  const pages = []
  const rewrites = []
  glob.sync('./src/pug/pages/*.pug').map(htmlFile => {
    pages.push(path.basename(htmlFile).replace(/\.pug/, '.html'))
  })
  pages.forEach(p => {
    rewrites.push({
      from: `/${p.replace(/\.html/, '')}`,
      to: `/${p}`
    })
  })
  return rewrites
}
// ===============================================

const devConfig = merge(baseConfig, {
  target: "web", // fix hot reload
  devtool: 'inline-source-map',
  // devtool: 'source-map',
  mode: 'development',
  devServer: {
    // contentBase: './dist',
    contentBase: path.resolve(__dirname, './dist'),
    // watchContentBase: true,
    open: true,
    // hot: true,
    // port: 8081,
    historyApiFallback: true,
    historyApiFallback: {
      rewrites: historyApiFallbackRewritesGenerator()
    },
    overlay: {
      warnings: false,
      errors: true
    }
    // plugins: []
  }
})

module.exports = new Promise((resolve, reject) => {
  resolve(devConfig)
})
