// Modal.js
import { useEffect } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrdonnancePDF from '../OrdonnancePDF';

const Modal = ({ isOpen, onClose, selectedPatient }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen || !selectedPatient) return null;

  const { prenom, name, age, symptoms, antecedents, medicaments, ordonnanceText } = selectedPatient;
  const displayOrdonnance = ordonnanceText || "Ordonnance non disponible";
  const displayName = `${prenom} `;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Ordonnance de {displayName}</h2>
        <div className="max-h-[60vh] overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            {displayOrdonnance}
          </pre>
        </div>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={onClose}>Fermer</button>
          <PDFDownloadLink
            document={
              <OrdonnancePDF
                name={displayName}
                age={age}
                symptoms={symptoms}
                medicalHistory={antecedents}
                medications={medicaments}
                diagnosis="Diagnostic généré"
                prescription={displayOrdonnance}
                recommendations="Suivez les conseils du médecin."
              />
            }
            fileName={`Ordonnance_${prenom}_${name}.pdf`}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-center block"
          >
            {({ loading }) => (loading ? "Génération..." : "Télécharger en PDF")}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Modal;