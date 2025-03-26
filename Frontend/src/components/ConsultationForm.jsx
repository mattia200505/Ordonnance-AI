import React, { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { position: "relative", fontSize: 12, fontFamily: "Helvetica" },
  docteur: { 
      position: "absolute",
      fontSize: 18,
      left: 60,
      top: 50, 
      width: "80%",
      padding: 10,
  },
  docteur_metier: { 
      position: "absolute",
      fontSize: 11,
      left: 92,
      top: 75, 
      width: "80%",
      padding: 10,
  },
  docteur_adresse: { 
      position: "absolute",
      fontSize: 9,
      left: 240,
      top: 62, 
      paddingLeft: 40,
      paddingRight: 25,
      paddingTop: 23,
      borderRight: "1 solid black"
  },
  docteur_code_postale: { 
      position: "absolute",
      fontSize: 8,
      left: 250,
      top: 90,
      paddingLeft: 40,
      paddingRight: 33.4,
      paddingTop: 10,
      paddingBottom: 50,
      borderRight: "1 solid black"
  },
  patient_title: { 
      position: "absolute",
      fontSize: 8,
      left: 485,
      top: 80
  },
  patient_name: { 
      position: "absolute",
      fontSize: 9,
      left: 448,
      top: 92,
  },
  patient_naissance: { 
      position: "absolute",
      fontSize: 9,
      left: 465,
      top: 106,
  },
  date: { 
      position: "absolute",
      fontSize: 12,
      left: 360,
      top: 162,
  },
  
  section: { 
      position: "absolute",
      left: 50,
      top: 100,
      width: "80%",
      padding: 10, 
      borderBottom: "1 solid black",
  },
  text: {
      fontSize: 12,   
      lineHeight: 1.2,
      marginBottom: 5,
  },

  patientInfo: { top: 220 },  
  diagnostic: { top: 365 },
  prescription: { top: 430 },
  recommendations: { top: 510 },

  barcode: { 
      position: "absolute", 
      top: 103, 
      left: 127,
      width: 50, 
      height: 30
  }
});

const OrdonnancePDF = ({ name, prenom, age, symptoms, medicalHistory, medications, diagnosis, prescription, recommendations, taille, poids, genre }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.docteur}>Docteur Sekou Toure</Text>
      <Image 
          style={styles.barcode}
          src="code_barre.png" 
      />
      <Text style={styles.docteur_metier}>Médecin généraliste</Text>
      <Text style={styles.docteur_adresse}>122 Rue Paul Armangot</Text>
      <Text style={styles.docteur_code_postale}>94400 Vitry-sur-Seine</Text>
      <Text style={styles.patient_title}>Patient</Text>
      <Text style={styles.patient_name}>Monsieur {prenom} {name}</Text>
      <Text style={styles.patient_naissance}>né le {age}</Text>
      <Text style={styles.date}>Vitry-sur-Seine, le 20/03/2025</Text>

      <View style={{ ...styles.section, ...styles.patientInfo }}>
        <Text style={[{ fontWeight: "bold" }, styles.text]}>Patient :</Text>
        <Text style={styles.text}>Nom : {name}</Text>
        <Text style={styles.text}>Prénom : {prenom}</Text>
        <Text style={styles.text}>Âge : {age}</Text>
        <Text style={styles.text}>Symptômes : {symptoms}</Text>
        <Text style={styles.text}>Antécédents médicaux : {medicalHistory}</Text>
        <Text style={styles.text}>Médicaments actuels : {medications}</Text>
        <Text style={styles.text}>Taille : {taille} cm</Text>
        <Text style={styles.text}>Poids : {poids} kg</Text>
        <Text style={styles.text}>Genre : {genre}</Text>
      </View>

      <View style={{ ...styles.section, ...styles.diagnostic }}>
        <Text style={[{ fontWeight: "bold" }, styles.text]}>Diagnostic :</Text>
        <Text style={styles.text}>{diagnosis}</Text>
      </View>

      <View style={{ ...styles.section, ...styles.prescription }}>
        <Text style={[{ fontWeight: "bold" }, styles.text]}>Prescription :</Text>
        <Text style={styles.text}>{prescription}</Text>
      </View>

      <View style={{ ...styles.section, ...styles.recommendations }}>
        <Text style={[{ fontWeight: "bold" }, styles.text]}>Recommandations :</Text>
        <Text style={styles.text}>{recommendations}</Text>
      </View>
    </Page>
  </Document>
);

const parseResponse = (response) => {
  const [patientSection, ordonnanceSection] = response.split(" Ordonnance| ");
  const patientData = {};
  const ordonnanceData = {};

  patientSection.split("|").forEach((item) => {
    const [key, value] = item.split(":");
    if (key && value) {
      patientData[key.trim()] = value.trim();
    }
  });

  ordonnanceSection.split("|").forEach((item) => {
    const [key, value] = item.split(":");
    if (key && value) {
      ordonnanceData[key.trim()] = value.trim();
    }
  });

  return { patientData, ordonnanceData };
};

export const ConsultationForm = () => {
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [taille, setTaille] = useState("");
  const [poids, setPoids] = useState("");
  const [genre, setGenre] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");
    setIsGenerating(true);
    setIsComplete(false);

    try {
      const res = await fetch("http://localhost:5000/generate-prescription", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, prenom, age, symptoms, medicalHistory, medications, taille, poids, genre })
      });

      if (!res.body) throw new Error("Pas de flux de données reçu");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        setResponse((prev) => prev + decoder.decode(value, { stream: true }));
      }

      // Analyser la réponse et extraire les données
      const { patientData, ordonnanceData } = parseResponse(fullResponse);

      // Remplir les états avec les données extraites
      setDiagnosis(ordonnanceData.Diagnostic || "Non disponible");
      setPrescription(ordonnanceData.Prescription || "Non disponible");
      setRecommendations(ordonnanceData.Recommandations || "Non disponible");

      setIsComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-screen p-10 bg-gradient-to-br from-zinc-50 to-zinc-100">
      <h1 className="pb-4 mb-7 text-2xl text-center font-bold text-zinc-800 tracking-wider">
        Questionnaire Médical
      </h1>
      <div className="flex items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full p-3 border border-gray-300 rounded">
              <option value="">Sélectionnez le genre</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required />
            <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required />
            <input type="number" placeholder="Âge" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required />
            <input type="number" placeholder="Taille (cm)" value={taille} onChange={(e) => setTaille(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
            <input type="number" placeholder="Poids (kg)" value={poids} onChange={(e) => setPoids(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
            <textarea placeholder="Symptômes" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
            <textarea placeholder="Antécédents Médicaux" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
            <textarea placeholder="Médicaments Actuels" value={medications} onChange={(e) => setMedications(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
              {isGenerating ? "Génération..." : "Générer l'Ordonnance"}
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {response && (
            <div className="mt-6 p-6 bg-gray-100 rounded shadow-lg">
              <h2 className="text-xl font-semibold text-center">Ordonnance Générée</h2>
              <pre className="mt-2 whitespace-pre-wrap">{response}</pre>
              {isComplete && (
                <PDFDownloadLink
                  document={<OrdonnancePDF 
                    name={name} 
                    prenom={prenom}
                    age={age}
                    symptoms={symptoms} 
                    medicalHistory={medicalHistory} 
                    medications={medications} 
                    diagnosis={diagnosis} 
                    prescription={prescription} 
                    recommendations={recommendations} 
                    taille={taille} 
                    poids={poids} 
                    genre={genre} 
                  />}
                  fileName="ordonnance.pdf"
                  className="w-full bg-green-500 text-white py-3 rounded-lg mt-4 text-center block"
                >
                  {({ loading }) => (loading ? "Génération du PDF..." : "Télécharger l'Ordonnance PDF")}
                </PDFDownloadLink>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ConsultationForm;