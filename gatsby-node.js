exports.onCreateWebpackConfig = ({
    stage,
    rules,
    loaders,
    plugins,
    actions,
  }) => {
    actions.setWebpackConfig({
      resolve: {
          fallback: { "os": require.resolve("os-browserify/browser") }
      }
    })
  }