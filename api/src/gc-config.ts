import { Storage } from "@google-cloud/storage";
import cfenv from "cfenv";
require("dotenv").config();

const environment: string = process.env.NODE_ENV || "development";

var appEnv: any;
if (environment !== "development") {
  appEnv = cfenv.getAppEnv();
}

const gc: any =
  environment !== "development"
    ? new Storage({
        credentials: {
          client_email:
            appEnv.services["user-provided"][0].credentials.gc_email,
          private_key: appEnv.services["user-provided"][0].credentials.gc_pk,
        },
      })
    : new Storage({
        credentials: {
          client_email: process.env.CLIENT_EMAIL,
          private_key:
            process.env.PRIVATE_KEY &&
            process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
        },
      });

const files: { [key: string]: string } = {
  bucket: "us-east1-dta-airflow-b3415db4-bucket",
  browser_total_monthly:
    "data/analytics/project_ursa_major/browser_12months_daily_snapshot_doi.json",
  uniqueViews:
    "data/analytics/project_ursa_major/uniquevisitors_90days_daily_snapshot_doi.json",
  hourly_unique_views:
    "data/analytics/project_ursa_major/uniquevisitors_90days_hourly_snapshot_doi.json",
  operating_system_views:
    "data/analytics/project_ursa_major/opsys_12months_daily_snapshot_doi.json",
};

export { gc, files };
