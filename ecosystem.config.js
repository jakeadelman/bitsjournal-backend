module.exports = {
  apps: [
    {
      name: "start",
      script: "./dist/index.js",
      instances: 4,
      exec_mode: "cluster",
    },
    {
      name: "fetch-trades",
      script: "./dist/bitmex/trades/fetchTrades.js",
    },
    {
      name: "fetch-execution",
      script: "./dist/bitmex/execution/fetchExecution.js",
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "138.197.167.123",
      ref: "origin/master",
      repo: "git@github.com:jakeadelman/bitsjournal-backend.git",
      path: "/root/server",
      "pre-deploy-local": "",
      "post-deploy": "yarn && npx pm2 reload ecosystem.config.js",
      "pre-setup": "",
    },
  },
};
