import mongoose from "mongoose";

const ordonnanceSchema = new mongoose.Schema({
  prescription: String,
  diagnosis: String,
  recommendations: String,
  createdAt: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  age: Number,
  symptomes: String,
  antecedents: String,
  medicaments: String,
  ordonnanceText: String,
  dateAjout: { type: Date, default: Date.now },
  ordonnances: [ordonnanceSchema], // Ajout du champ ordonnances
});

const Patient = mongoose.model("Patient", patientSchema);

export { Patient };
