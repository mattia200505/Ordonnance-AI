import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { position: "relative", fontSize: 12, fontFamily: "Helvetica" },

  // En-tête du médecin
  header: { textAlign: "left", margin: 40, marginBottom: 20 },
  docteur: { fontSize: 18, fontWeight: "bold" },
  docteur_metier: { fontSize: 12 },
  docteur_adresse: { fontSize: 10 },

  // Informations du patient
  patient_info: { textAlign: "right", marginRight: 40, marginBottom: 20 },
  patient_title: { fontSize: 14, fontWeight: "bold" },
  patient_text: { fontSize: 12 },
  date: { fontSize: 12, marginTop: 5 },

  // Sections de l'ordonnance
  section: { marginHorizontal: 40, marginBottom: 15, padding: 10 },
  section_title: { fontSize: 13, fontWeight: "bold", marginBottom: 5 },
  text: { fontSize: 12, lineHeight: 1.5 },

  separator: { height: 1, backgroundColor: "black", marginVertical: 10 }
});

const OrdonnancePDF = ({ name, age, symptoms, medicalHistory, medications, diagnosis, prescription, recommendations }) => {
  console.log("Données de prescription reçues:", prescription);

  // Vérification et extraction des données de l'IA
  let parsedDiagnosis = "Diagnostic non spécifié";
  let parsedPrescription = "Prescription non spécifiée";
  let parsedRecommendations = "Suivez les conseils du médecin.";

  if (prescription && typeof prescription === "string") {
    const diagnosticMatch = prescription.match(/Diagnostic:\s*(.*)/);
    const prescriptionMatch = prescription.match(/Prescription:\s*(.*)/);
    const recommendationsMatch = prescription.match(/Recommandations:\s*(.*)/);

    if (diagnosticMatch) parsedDiagnosis = diagnosticMatch[1].trim();
    if (prescriptionMatch) parsedPrescription = prescriptionMatch[1].trim();
    if (recommendationsMatch) parsedRecommendations = recommendationsMatch[1].trim();
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête du médecin */}
        <View style={styles.header}>
          <Text style={styles.docteur}>Docteur Mattia Checchia</Text>
          <Text style={styles.docteur_metier}>Médecin généraliste</Text>
          <Text style={styles.docteur_adresse}>68 Rue Velpeau</Text>
          <Text style={styles.docteur_adresse}>92160 Antony</Text>
        </View>

        {/* Informations du patient */}
        <View style={styles.patient_info}>
          <Text style={styles.patient_title}>Patient</Text>
          <Text style={styles.patient_text}>Monsieur {name}</Text>
          <Text style={styles.patient_text}>Âge : {age} ans</Text>
          <Text style={styles.date}>Antony, le 20/03/2025</Text>
        </View>

        <View style={styles.separator} />

        {/* Section Informations du patient */}
        <View style={styles.section}>
          <Text style={styles.section_title}>Informations du Patient :</Text>
          <Text style={styles.text}>Nom : {name}</Text>
          <Text style={styles.text}>Âge : {age} ans</Text>
          <Text style={styles.text}>Symptômes : {symptoms || "Non spécifié"}</Text>
          <Text style={styles.text}>Antécédents médicaux : {medicalHistory || "Non spécifié"}</Text>
          <Text style={styles.text}>Médicaments actuels : {medications || "Non spécifié"}</Text>
        </View>

        <View style={styles.separator} />

        {/* Section Diagnostic */}
        <View style={styles.section}>
          <Text style={styles.section_title}>Diagnostic :</Text>
          <Text style={styles.text}>{parsedDiagnosis}</Text>
        </View>

        <View style={styles.separator} />

        {/* Section Prescription */}
        <View style={styles.section}>
          <Text style={styles.section_title}>Prescription :</Text>
          <Text style={styles.text}>{parsedPrescription}</Text>
        </View>

        <View style={styles.separator} />

        {/* Section Recommandations */}
        <View style={styles.section}>
          <Text style={styles.section_title}>Recommandations :</Text>
          <Text style={styles.text}>{parsedRecommendations}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrdonnancePDF;
