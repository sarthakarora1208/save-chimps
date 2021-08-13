import { BUCKET_NAME } from "./../constants/misc";
import { RevisionRequest } from "./../entities/RevisionRequest";
import fs from "fs";
const fsPromises = require("fs").promises;
import path from "path";
import axios from "axios";
import { s3bucket } from "../server";
export const downloadImagesForRevisionRequests = async (
  revisionRequests: RevisionRequest[]
) => {
  let i;

  let result;
  for (i = 0; i < revisionRequests.length; i++) {
    let key = revisionRequests[i].editedMapURL.replace(
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
    console.log(key);
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    let data = await s3bucket.getObject(params).promise();
    fs.writeFileSync(FOLDER_PATH, data.Body! as string);
    console.log("image downloaded");
  }
};
