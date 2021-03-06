import express, { Application } from "express";
import graphqlHTTP from "express-graphql";
import Rschema from "./schema";
import cors from "cors";
import helmet from "helmet";
import redis from "redis";
import cfenv from "cfenv";
import bodyParser from "body-parser";
const env = process.env.NODE_ENV || "dev";

let appEnv: any;
if (env !== "dev") {
  appEnv = cfenv.getAppEnv();
}
const { hostname, port, password, url } =
  env !== "dev" && appEnv.services["redis"][0].credentials;

const PORT: number | string = process.env.PORT || 3000;

const redis_client =
  env === "dev"
    ? redis.createClient({ port: 6379 })
    : redis.createClient({ host: hostname, port, password, url });

redis_client.flushall();
const app: Application = express();

env === "dev" && app.use(cors());

app.use(bodyParser.json());

app.use(helmet());

app.use(
  "/api",
  graphqlHTTP({
    schema: Rschema,
    graphiql: env === "dev",
    context: {
      redis_client,
    },
  })
);

app.listen(PORT, () => `Server started on port ${PORT}`);

export default app;
