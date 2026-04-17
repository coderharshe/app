import { google } from "googleapis";
import { Readable } from "stream";

// Scopes for Google Drive API
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

/**
 * Initialize the Google Drive client using a Service Account
 */
async function getDriveClient() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  // Handle newlines in private key from env
  const privateKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google Drive credentials (CLIENT_EMAIL or PRIVATE_KEY) are missing in environment variables.");
  }

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    SCOPES
  );

  return google.drive({ version: "v3", auth });
}

/**
 * Upload a file to Google Drive and return the public URL
 */
export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) {
  const drive = await getDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata = {
    name: fileName,
    parents: folderId ? [folderId] : [],
  };

  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  try {
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });

    const fileId = response.data.id;

    if (!fileId) {
      throw new Error("Failed to get file ID after upload.");
    }

    // Make the file public (Anyone with the link can view)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Return the "uc" link which is more reliable for direct img tags
    // GDrive links are often: https://drive.google.com/uc?id=FILE_ID
    return `https://drive.google.com/uc?id=${fileId}`;
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    throw error;
  }
}
