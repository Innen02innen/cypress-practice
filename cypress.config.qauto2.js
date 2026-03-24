import baseConfig from "./cypress.config.js";

export default {
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://qauto2.forstudy.space",
    env: {
      USER_EMAIL: "innen@ukr.net",
      USER_PASSWORD: "2Pdvns7i",
    },
  },
};