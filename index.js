const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Replace with your actual object type ID (e.g., "paws_pet")
const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT = "paws_pet"; // custom object ID from HubSpot

// 🏠 1️⃣ Homepage Route - Displays custom object records in a table
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}?properties=Name,breed,bio`,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
        },
      }
    );

    const records = response.data.results;

    res.render("homepage", {
      title: "Custom Objects Table",
      records: records,
    });
  } catch (error) {
    console.error("Error fetching custom objects:", error.response?.data || error.message);
    res.status(500).send("Error loading data");
  }
});

// 📝 2️⃣ Form Page Route - Displays the HTML form to add a custom object
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// 📨 3️⃣ Form Submission Route - Creates a new custom object record
app.post("/update-cobj", async (req, res) => {
  const { name, breed, bio } = req.body;

  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`,
      {
        properties: {
          Name: name,
          breed: breed,
          bio: bio,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error creating custom object:", error.response?.data || error.message);
    res.status(500).send("Error submitting form");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
