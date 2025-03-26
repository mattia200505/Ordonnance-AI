import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "/src/pages/Dashboard";
import PatientForm from "./components/patientForm"; // Importation de ton form PatientForm

const App = () => {
  return (
    <Router basename="/tasks-react">
      <div className="h-screen flex flex-col w-screen p-10 bg-gradient-to-br from-zinc-50 to-zinc-100">
        <nav className="mb-4 flex justify-center gap-4">
          <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">Tableau de Bord</Link>
          <Link to="/form" className="px-4 py-2 bg-green-500 text-white rounded">Ajouter un Patient</Link>
        </nav>
        <Routes>
          {/* Route pour le tableau de bord */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Route pour le formulaire PatientForm */}
          <Route path="/form" element={<PatientForm />} /> {/* Modifié ici */}
          
          {/* Ajouter la redirection par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
