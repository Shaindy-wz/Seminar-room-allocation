const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Cloud"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// נקודת קצה (Endpoint) לבדיקה
app.get('/api/status', (req, res) => {
  res.json({ message: "Server is running and connected to DB!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));