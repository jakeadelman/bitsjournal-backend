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
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "fetch-execution",
      script: "./dist/bitmex/execution/fetchExecution.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "138.197.167.123",
      ref: "origin/master",
      repo: "git@github.com:jakeadelman/bitsjournal-backend.git",
      // repo: "https://github.com/jakeadelman/bitsjournal-backend.git",
      path: "/root",
      ssh_options: ["ForwardAgent=yes"],
      "pre-deploy-local": "",
      "post-deploy": "yarn && npx tsc && npx pm2 reload ecosystem.config.js",
      "pre-setup": "",
    },
  },
};
