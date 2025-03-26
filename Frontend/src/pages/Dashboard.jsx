import { useState, useEffect } from "react";
import ConsultationChart from "../components/ConsultationChart";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visiblePatients, setVisiblePatients] = useState(2);
  const [hasDisplayedMore, setHasDisplayedMore] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5000/patients");
        const data = await response.json();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des patients:", err);
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleShowMore = () => {
    setVisiblePatients((prev) => Math.min(prev + 4, patients.length));
    setHasDisplayedMore(true);
  };

  const handleShowLess = () => {
    setVisiblePatients(2);
    setHasDisplayedMore(false);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Tableau de Bord</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:scale-105 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">Total Patients</h2>
          <p className="text-2xl font-bold text-blue-500 mt-2">{patients.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:scale-105 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-gray-700">Rendez-vous</h2>
          <p className="text-2xl font-bold text-green-500 mt-2">24</p>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-6 mt-6 max-h-[70vh] overflow-y-scroll">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Liste des Patients</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ul>
            {patients.slice(0, visiblePatients).map((patient) => (
              <li
                key={patient._id}
                className="p-2 mb-4 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handlePatientClick(patient)}
              >
                <h3 className="font-semibold">{patient.prenom} {patient.name}</h3>
                <p><strong>Âge:</strong> {patient.age}</p>
              </li>
            ))}
          </ul>
        )}
        {visiblePatients < patients.length && (
          <button onClick={handleShowMore} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Afficher plus
          </button>
        )}
        {hasDisplayedMore && (
          <button onClick={handleShowLess} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
            Afficher moins
          </button>
        )}
      </div>

      {selectedPatient && (
        <Modal isOpen={isModalOpen} onClose={closeModal} selectedPatient={selectedPatient} ordonnanceText={selectedPatient.ordonnanceText} />
      )}
    </div>
  );
};

export default Dashboard;