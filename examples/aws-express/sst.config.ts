/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-express",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("MyVpc", { bastion: true });
    const redis = new sst.aws.Redis("MyRedis", { vpc });
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    cluster.addService("MyService", {
      link: [redis],
      public: {
        ports: [{ listen: "80/http" }],
      },
      dev: {
        command: "node --watch index.mjs",
      },
    });
  }
});
