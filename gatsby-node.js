const webpack = require('webpack');

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        process: 'process/browser'
      },
      fallback: {
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/")
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  })
}