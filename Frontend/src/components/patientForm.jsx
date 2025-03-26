import { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrdonnancePDF from "../OrdonnancePDF";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    age: "",
    genre: "Homme",
    taille: "",
    poids: "",
    symptomes: "",
    antecedents: "",
    medicaments: "",
  });

  const [ordonnance, setOrdonnance] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (ordonnance) {
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + ordonnance[index]);
        index++;
        if (index === ordonnance.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [ordonnance]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      nom: "",
      prenom: "",
      age: "",
      genre: "Homme",
      taille: "",
      poids: "",
      symptomes: "",
      antecedents: "",
      medicaments: "",
    });
    setOrdonnance("");
    setTypedText("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const patientData = {
      name: formData.nom,
      prenom: formData.prenom,
      age: Number(formData.age) || 0,
      taille: Number(formData.taille) || 0,
      poids: Number(formData.poids) || 0,
      symptoms: formData.symptomes,
      medicalHistory: formData.antecedents || "Non renseigné",
      medications: formData.medicaments || "Aucun",
    };

    try {
      const response = await fetch("http://localhost:5000/generate-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur");
      }

      const result = await response.text();
      setOrdonnance(result);
    } catch (error) {
      console.error("❌ Erreur API :", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* FORMULAIRE À GAUCHE */}
      <div className="w-1/2 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center">Ajouter un Patient</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} className="p-2 border rounded-md" required />
            <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} className="p-2 border rounded-md" required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <input type="number" name="age" placeholder="Âge" value={formData.age} onChange={handleChange} className="p-2 border rounded-md" required />
            <input type="number" name="taille" placeholder="Taille (cm)" value={formData.taille} onChange={handleChange} className="p-2 border rounded-md" />
            <input type="number" name="poids" placeholder="Poids (kg)" value={formData.poids} onChange={handleChange} className="p-2 border rounded-md" />
          </div>

          <select name="genre" value={formData.genre} onChange={handleChange} className="w-full p-2 border rounded-md">
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>

          <textarea name="symptomes" placeholder="Décrivez les symptômes" value={formData.symptomes} onChange={handleChange} className="w-full p-2 border rounded-md h-20" required></textarea>

          <textarea name="antecedents" placeholder="Antécédents médicaux" value={formData.antecedents} onChange={handleChange} className="w-full p-2 border rounded-md h-20"></textarea>

          <textarea name="medicaments" placeholder="Médicaments actuels" value={formData.medicaments} onChange={handleChange} className="w-full p-2 border rounded-md h-20"></textarea>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition" disabled={loading}>
            {loading ? "Génération..." : "Générer l’ordonnance"}
          </button>

          <button type="button" onClick={handleReset} className="w-full p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
            Réinitialiser
          </button>
        </form>
      </div>

      {/* ORDONNANCE À DROITE */}
      <div className="w-1/2 p-6 bg-gray-100 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Ordonnance</h3>

        {ordonnance ? (
          <div className="p-4 border rounded-md bg-white text-gray-800 h-80 overflow-y-auto">
            <p className="whitespace-pre-line">{typedText}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">Aucune ordonnance générée.</p>
        )}

        {ordonnance && (
          <PDFDownloadLink
            document={
              <OrdonnancePDF
                name={`${formData.nom} ${formData.prenom}`}
                age={formData.age}
                symptoms={formData.symptomes}
                medicalHistory={formData.antecedents}
                medications={formData.medicaments}
                diagnosis="Diagnostic généré"
                prescription={ordonnance}
                recommendations="Suivez les conseils du médecin."
              />
            }
            fileName={`Ordonnance_${formData.nom}_${formData.prenom}.pdf`}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-center block"
          >
            {({ loading }) => (loading ? "Génération..." : "Télécharger en PDF")}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default PatientForm;