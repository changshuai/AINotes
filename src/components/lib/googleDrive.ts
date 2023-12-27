import { google } from "googleapis"

// authenticates the service account to be used in this context
const auth = new google.auth.GoogleAuth({
    // your credentials to authenticate
    keyFile: process.cwd() + "/credentials.json",
    // the actions you are permissed to perform using this API, in this case
    // all CRUD operations are permissed, check out
    // [ https://developers.google.com/drive/api/guides/api-specific-auth ]
    // for more advice on scopes
    scopes: ["https://www.googleapis.com/auth/drive"],
  })

export const getData = async () => {
  // allows you to use drive API methods e.g. listing files, creating files.
  const drive = google.drive({ version: "v3", auth })
  console.log("XXXXX: " + "getData from google driver.")
  try {
    const res = await drive.files.list()
    const files = res.data.files

    console.log("XXXXX: " + files)
  } catch (error: any) {
    console.error("Error fetching files:", error.message)
    return null
  }
}