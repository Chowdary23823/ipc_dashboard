import express from "express";
import cors from "cors";
import { google } from "googleapis";
import path from "path";
import { setInterval } from 'timers';

const app = express();
app.use(cors());

// A variable to store the latest sheet data
let sheetData = null; // For D-1 Reservation
let reliabilityweek = null; // For Reliability
let eagleeye = null;  //eagle
let FDP_view = null; //FDP

// Google Sheets auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join("service-account.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// Function to fetch and update the global sheet data variable for "D-1 Reservation"
const fetchAndStoreData = async () => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1enVTHFGgBz0IqL0VSHWynbcIZPn_Xf44ZuPvwdK1Qzs";
    const range = "D-1 Reservation";

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    if (!response.data || !response.data.values) {
      console.error("No data found in the 'D-1 Reservation' sheet.");
      return;
    }
    sheetData = response.data;
    console.log("Data for 'D-1 Reservation' successfully refreshed from Google Sheets.");
  } catch (err) {
    console.error("Failed to fetch 'D-1 Reservation' sheet data:", err.message);
    sheetData = null;
  }
};

// Function to fetch and update the global sheet data variable for "Reliability"
const fetchDataForReliability = async () => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1enVTHFGgBz0IqL0VSHWynbcIZPn_Xf44ZuPvwdK1Qzs";
    const range = "Reliability";

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    if (!response.data || !response.data.values) {
      console.error("No data found in the 'Reliability' sheet.");
      return;
    }
    reliabilityweek = response.data;
    console.log("Data for 'Reliability' successfully refreshed from Google Sheets.");
  } catch (err) {
    console.error("Failed to fetch 'Reliability' sheet data:", err.message);
    reliabilityweek = null;
  }
};

const fetchAndStoreeagle = async () => { //eagle
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1enVTHFGgBz0IqL0VSHWynbcIZPn_Xf44ZuPvwdK1Qzs";
    const range = "EagleEye";

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    if (!response.data || !response.data.values) {
      console.error("No data found in the 'EagleEye' sheet.");
      return;
    }
    eagleeye = response.data;
    console.log("Data for 'EagleEye' successfully refreshed from Google Sheets.");
  } catch (err) {
    console.error("Failed to fetch 'EagleEye' sheet data:", err.message);
    eagleeye = null;
  }
};

const fetchAndStoreFDP = async () => { //FDP
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1enVTHFGgBz0IqL0VSHWynbcIZPn_Xf44ZuPvwdK1Qzs";
    const range = "FDP_Pendency";

    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    if (!response.data || !response.data.values) {
      console.error("No data found in the 'FDP' sheet.");
      return;
    }
    FDP_view = response.data;
    console.log("Data for 'FDP' successfully refreshed from Google Sheets.");
  } catch (err) {
    console.error("Failed to fetch 'FDP' sheet data:", err.message);
    FDP_view = null;
  }
};

const fetchAndStoreFDPMuiltiSheets = async () => { //FDP
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1enVTHFGgBz0IqL0VSHWynbcIZPn_Xf44ZuPvwdK1Qzs";
    //const range = "FDP_Demo";

    const sheetNames = ["Day_Start", "FDP_Pendency"];
     
    var sheetsData;

    for (const name of sheetNames) {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: name, // whole sheet
    });
    
    sheetData[name] = res.data;
    console.log(`Data from ${name}:`, res.data.values);
    }

    FDP_view = sheetData;

    // const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    // if (!response.data || !response.data.values) {
    //   console.error("No data found in the 'FDP' sheet.");
    //   return;
    // }
    // FDP_view = response.data;
    console.log("Data for 'FDP' successfully refreshed from Google Sheets.");
  } catch (err) {
    console.error("Failed to fetch 'FDP' sheet data:", err.message);
    FDP_view = null;
  }
};

// Initial data fetch when the server starts
fetchAndStoreData();
fetchDataForReliability();
fetchAndStoreeagle();
fetchAndStoreFDPMuiltiSheets();

// Schedule data refresh every 60 seconds
setInterval(fetchAndStoreData, 60000);
setInterval(fetchDataForReliability, 60000);
setInterval(fetchAndStoreeagle, 60000);
setInterval(fetchAndStoreFDPMuiltiSheets, 60000);

// Root route to show the server is working
app.get("/", (req, res) => {
  res.send("Backend server is running.");
});

// API endpoint to manually trigger a data refresh for D-1 Reservation
app.get("/api/refresh-d1-data", async (req, res) => {
  await fetchAndStoreData();
  res.status(200).json({ message: "D-1 Reservation data refresh triggered successfully." });
});

// API endpoint to manually trigger a data refresh for Reliability
app.get("/api/refresh-reliability-data", async (req, res) => {
  await fetchDataForReliability();
  res.status(200).json({ message: "Reliability data refresh triggered successfully." });
});

app.get("/api/refresh-eagle-data", async (req, res) => { //eagle
  await fetchAndStoreeagle();
  res.status(200).json({ message: "EagleEye data refresh triggered successfully." });
});

app.get("/api/refresh-FDP-data", async (req, res) => { //FDP
  await fetchAndStoreFDP();
  res.status(200).json({ message: "FDP data refresh triggered successfully." });
});


// API endpoint to serve the stored "D-1 Reservation" data
app.get("/api/sheets-data", (req, res) => {
  if (sheetData) {
    res.json(sheetData);
  } else {
    res.status(503).json({
      error: "Data is not yet available or failed to load. Please try again in a few moments."
    });
  }
});

app.get("/api/eagle-data", (req, res) => { //eagle
  if (eagleeye) {
    res.json(eagleeye);
  } else {
    res.status(503).json({
      error: "Data is not yet available or failed to load. Please try again in a few moments."
    });
  }
});

app.get("/api/FDP-data", (req, res) => { //FDP
  if (FDP_view) {
    res.json(FDP_view);
  } else {
    res.status(503).json({
      error: "Data is not yet available or failed to load. Please try again in a few moments."
    });
  }
});


// API endpoint to serve the stored "Reliability" data
app.get("/api/reliability-data", (req, res) => {
  if (reliabilityweek) {
    res.json(reliabilityweek);
  } else {
    res.status(503).json({
      error: "Data is not yet available or failed to load. Please try again in a few moments."
    });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));

