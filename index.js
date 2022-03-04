const express = require("express");
const { google } = require("googleapis");
const keys = require("./keys.json");
const path = require("path");
//initialize express
const app = express();
app.use(express.urlencoded({ extended: true }));

const SPREADSHEET_ID = "1lMipLSQ0nmXd3dJZX38cypnJlwutf4VExSjtEt39tTs";

// index route
app.get("/", async (request, response) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  //Auth client Object
  const authClientObject = await auth.getClient();
  //Google sheets instance
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  // spreadsheet id
  const spreadsheetId = SPREADSHEET_ID;

  let ranges = ["sheet2!a1:k1", "sheet2!a3:k974"];

  const readData = await googleSheetsInstance.spreadsheets.values.batchGet({
    auth, //auth object
    spreadsheetId, // spreadsheet id
    ranges: ranges, //range of cells to read from.
  });

  console.log("Data read ", readData.data.valueRanges);

  response.send(readData.data.valueRanges);
  //   response.render("index");
});

app.post("/", async (request, response) => {
  const { article, author } = request.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    scopes: "https://www.googleapis.com/auth/spreadsheets", //url to spreadsheets API
  });
  //Auth client Object
  const authClientObject = await auth.getClient();
  //Google sheets instance
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  // spreadsheet id
  const spreadsheetId = SPREADSHEET_ID;

  // Get metadata about spreadsheet
  const sheetInfo = await googleSheetsInstance.spreadsheets.get({
    auth,
    spreadsheetId,
  });
  //   console.log("sheetInfo.data ", sheetInfo.data);

  //write data into the google sheets
  const writeData = await googleSheetsInstance.spreadsheets.values.append({
    auth, //auth object
    spreadsheetId, //spreadsheet id
    range: "Sheet2!A:B", //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[article, author]],
    },
  });
  //   console.log("writeData ", writeData);
  response.send("Request submitted.!!");
});

const PORT = 3000;

//start server
const server = app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
