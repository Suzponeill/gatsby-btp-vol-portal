require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "production"}`,
});

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `gatsby_btp_vol_portal`,
    siteUrl: `https://gatsbybtpvolportalmain.gatsbyjs.io/`,
  },
  flags: {
    FUNCTIONS: true,
  },
  plugins: [],
};
