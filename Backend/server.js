import express from 'express';
import ollama from 'ollama';
import cors from 'cors';
import mongoose from 'mongoose';
import { Patient } from './models/Patient.js';

const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/ordonnances', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("❌ Erreur de connexion MongoDB:", err));

// Route pour générer une ordonnance médicale avec Ollama et la sauvegarder dans MongoDB
app.post('/generate-prescription', async (req, res) => {
  const { prenom, name, age, taille, poids, symptoms, medicalHistory, medications } = req.body;

  // Vérifie si toutes les données nécessaires sont présentes
  if (!prenom || !name || !age || !symptoms) {
    return res.status(400).json({ error: "❌ Les champs 'prenom', 'name', 'age' et 'symptoms' sont obligatoires." });
  }

  // Préparer le prompt pour Ollama
  const prompt = `
  Tu es un générateur d'ordonnances médicales **rigoureusement précis**.  
  Tu dois **analyser uniquement les symptômes donnés par le médecin** et **produire un diagnostic, une prescription et des recommandations médicales adaptées**.  
  **Tu NE DOIS RIEN ÉCRIRE D'AUTRE avant, après ou entre les lignes du format attendu car elles seront parsées.**  
  ---  
  **FORMAT EXACT ATTENDU :**  

  Patient |  
  Prénom: ${prenom}  
  Nom: ${name}  
  Âge: ${age} ans  
  Taille: ${taille} cm  
  Poids: ${poids} kg  
  Symptômes: ${symptoms}  
  Antécédents médicaux: ${medicalHistory || "Non renseigné"}  
  Médicaments actuels: ${medications || "Aucun"}  

  Ordonnance |  
  Diagnostic: (Diagnostic basé uniquement sur les symptômes donnés)  
  Prescription: (Médicaments avec posologie claire, sinon "Aucune prescription")  
  Recommandations: (Conseils adaptés, sinon "Aucune recommandation spécifique")  
  `;

  try {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const stream = await ollama.chat({
      model: 'mistral', 
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    let ordonnanceText = '';
    for await (const chunk of stream) {
      const chunkContent = chunk.message.content;
      ordonnanceText += chunkContent; 
      res.write(chunkContent); 
    }
    res.end(); 

    // Sauvegarder les informations dans MongoDB
    const newPatient = new Patient({
      prenom,
      name,
      age,
      taille,
      poids,
      symptoms,
      medicalHistory,
      medications,
      ordonnanceText,
    });
    
    await newPatient.save();
    console.log("✅ Ordonnance enregistrée dans MongoDB");

  } catch (err) {
    console.error("❌ Erreur lors du streaming ou de l'enregistrement:", err);
    res.status(500).json({ error: "Erreur lors du streaming ou de l'enregistrement de l'ordonnance" });
  }
});

// Route pour récupérer tous les patients
app.get('/patients', async (req, res) => {
  try {
    // Récupérer les patients avec leurs ordonnances
    const patients = await Patient.find(); 

    // Formater les résultats si nécessaire, mais ici tu peux renvoyer les données telles quelles
    const patientsWithDetails = patients.map(patient => ({
      id: patient._id,
      prenom: patient.prenom,
      name: patient.name,
      age: patient.age,
      taille: patient.taille,
      poids: patient.poids,
      symptoms: patient.symptoms,
      medicalHistory: patient.medicalHistory,
      medications: patient.medications,
      ordonnanceText: patient.ordonnanceText
    }));

    // Retourner la liste des patients avec leurs informations
    res.json(patientsWithDetails); 
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des patients:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des patients' });
  }
});

// Route pour récupérer toutes les ordonnances
app.get('/ordonnances', async (req, res) => {
  try {
    const patients = await Patient.find();

    const ordonnancesWithId = patients.map(patient => ({
      id: patient._id,
      ...patient.toObject(),
    }));

    res.json(ordonnancesWithId);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des ordonnances:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des ordonnances' });
  }
});

// Route pour supprimer une ordonnance par ID
app.delete('/ordonnances/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Patient.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: '✅ Ordonnance supprimée avec succès.' });
    } else {
      res.status(404).json({ message: '❌ Ordonnance non trouvée.' });
    }
  } catch (err) {
    console.error('❌ Erreur lors de la suppression:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
