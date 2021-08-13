import { BUCKET_NAME } from "./../constants/misc";
import fs from "fs";
const fsPromises = require("fs").promises;
import path from "path";
import { s3bucket } from "../server";
import { Audit } from "../entities/Audit";

export const downloadImagesForAudit = async (audit: Audit) => {
  let i;
  let key = audit.finalMapUrl.replace(
    "https://bucket-1234.s3.amazonaws.com/",
    ""
  );
  const FOLDER_PATH = path.join(
    __dirname,
    "..",
    "public",
    "uploads",
    `${key}.jpg`
  );
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  let data = await s3bucket.getObject(params).promise();
  fs.writeFileSync(FOLDER_PATH, data.Body! as string);
  console.log("image downloaded");
};
