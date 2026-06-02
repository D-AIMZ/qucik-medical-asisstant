const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/medicalApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Doctor = require("./models/Doctor");

// Sample API to get doctors
app.get("/api/doctors", async (req, res) => {
    const doctors = await Doctor.find();
    res.json(doctors);
});

// Add doctor
app.post("/api/doctors", async (req, res) => {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.json(doctor);
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});