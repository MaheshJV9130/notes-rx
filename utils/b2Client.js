import axios from "axios";
import crypto from "crypto";

let b2AccessToken = null;
let b2ApiUrl = null;
let b2DownloadUrl = null;

export async function initializeB2() {
  if (b2AccessToken) {
    return { accessToken: b2AccessToken, apiUrl: b2ApiUrl, downloadUrl: b2DownloadUrl };
  }

  try {
    const authString = Buffer.from(
      `${process.env.B2_APPLICATION_KEY_ID}:${process.env.B2_APPLICATION_KEY}`
    ).toString("base64");

    const response = await axios.post("https://api.backblazeb2.com/b2api/v3/b2_authorize_account", null, {
      headers: {
        Authorization: `Basic ${authString}`,
      },
    });

    b2AccessToken = response.data.authorizationToken;
    b2ApiUrl = response.data.apiUrl;
    b2DownloadUrl = response.data.downloadUrl;

    console.log("[v0] B2 authorized successfully");
    return { accessToken: b2AccessToken, apiUrl: b2ApiUrl, downloadUrl: b2DownloadUrl };
  } catch (error) {
    console.error("[v0] B2 initialization error:", error);
    throw new Error("Failed to initialize B2 client");
  }
}

export async function uploadToB2(fileName, fileBuffer, mimeType = "application/pdf") {
  try {
    const b2 = await initializeB2();
    const bucketId = process.env.B2_BUCKET_ID;

    if (!bucketId) {
      throw new Error("B2_BUCKET_ID not configured");
    }

    // Get upload URL
    const uploadUrlResponse = await axios.post(
      `${b2.apiUrl}/b2api/v3/b2_get_upload_url`,
      { bucketId },
      {
        headers: {
          Authorization: b2.accessToken,
        },
      }
    );

    const uploadUrl = uploadUrlResponse.data.uploadUrl;
    const uploadAuthToken = uploadUrlResponse.data.authorizationToken;

    // Upload file
    const sha1 = crypto.createHash("sha1").update(fileBuffer).digest("hex");

    const uploadResponse = await axios.post(uploadUrl, fileBuffer, {
      headers: {
        Authorization: uploadAuthToken,
        "X-Bz-File-Name": fileName,
        "Content-Type": mimeType,
        "X-Bz-Content-Sha1": sha1,
      },
    });

    console.log("[v0] File uploaded to B2:", fileName, "FileId:", uploadResponse.data.fileId);

    return uploadResponse.data;
  } catch (error) {
    console.error("[v0] B2 upload error:", error);
    throw new Error("Failed to upload file to B2: " + error.message);
  }
}

export function getB2PublicUrl(fileName) {
  const bucketName = process.env.B2_BUCKET_NAME;
  const region = process.env.B2_REGION || "us-west-000";
  return `https://${bucketName}.s3.${region}.backblazeb2.com/file/${bucketName}/${fileName}`;
}

export async function deleteFromB2(fileName) {
  try {
    const b2 = await initializeB2();
    const bucketId = process.env.B2_BUCKET_ID;

    const fileInfo = await b2.listFileVersions(bucketId, fileName);
    if (fileInfo.files.length > 0) {
      const fileId = fileInfo.files[0].fileId;
      await b2.deleteFile(fileId, fileName);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[v0] B2 delete error:", error);
    throw new Error("Failed to delete file from B2");
  }
}
