require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `gatsby_btp_vol_portal`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  flags: {
    FUNCTIONS: true,
  },
  plugins: [],
};
