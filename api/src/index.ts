import express, { Application } from "express";
import graphqlHTTP from "express-graphql";
import Rschema from "./schema";
import cors from "cors";
import helmet from "helmet";
import redis from "redis";
import cfenv from "cfenv";
import bodyParser from "body-parser";
var env = process.env.NODE_ENV || "dev";

const appEnv: any = cfenv.getAppEnv();

const { hostname, port, password } =
  env !== "dev" && appEnv.services["redis"][0].credentials;

const PORT: Number | string = process.env.PORT || 3000;

const redis_client =
  env === "dev"
    ? redis.createClient({ port: 6379 })
    : redis.createClient({ host: hostname, port, password });

redis_client.set("message", "hell0 world");

const app: Application = express();

env === "dev" && app.use(cors());

app.use(bodyParser.json());

app.use(helmet());

app.use(
  "/api",
  graphqlHTTP((req) => ({
    schema: Rschema,
    graphiql: env === "dev",
    context: {
      redis_client,
      req,
    },
  }))
);

app.get("/redis_test", (req, res) => {
  redis_client.get("message", (err, data) => {
    if (data !== null) {
      res.send(data);
    } else {
      res.send("key not found");
    }
  });
});

app.listen(PORT, () => `Server started on port ${PORT}`);
