module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "infoscreen_gatsby",
  },
  plugins: [
    "gatsby-plugin-typescript",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /weather/
        }
      }
    }
  ],
};
