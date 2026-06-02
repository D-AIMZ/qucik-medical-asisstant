const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: String,
    specialty: String,
    hospital: String,
    price: Number,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model("Doctor", doctorSchema);