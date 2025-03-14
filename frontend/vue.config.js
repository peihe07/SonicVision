const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/static/' : '/',
  devServer: {
    port: 8083,
    host: '0.0.0.0',
    hot: true,
    proxy: {
      '^/api/spotify': {
        target: 'https://api.spotify.com/v1',
        changeOrigin: true,
        pathRewrite: { '^/api/spotify': '' }
      },
      '^/api/tmdb': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        pathRewrite: { '^/api/tmdb': '' },
        headers: {
          'Authorization': `Bearer ${process.env.VUE_APP_TMDB_ACCESS_TOKEN}`
        }
      }
    },
    client: {
      overlay: true,
    },
    watchFiles: {
      paths: ['src/**/*', 'public/**/*'],
      options: {
        usePolling: true,
      },
    },
    open: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
      })
    ]
  }
});