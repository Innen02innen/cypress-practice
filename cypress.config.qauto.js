import baseConfig from "./cypress.config.js";

export default {
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    baseUrl: "https://qauto.forstudy.space",
    env: {
      USER_EMAIL: "innen-qauto@mail.com",
      USER_PASSWORD: "2Pdvns7i2",
    },
  },
};