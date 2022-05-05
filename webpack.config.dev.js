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
    static: ["./public"],
    open: true,
    hot: false,
    liveReload: true,
    historyApiFallback: true,
    historyApiFallback: {
      rewrites: historyApiFallbackRewritesGenerator()
    },
  }
})

module.exports = new Promise((resolve, reject) => {
  resolve(devConfig)
})
