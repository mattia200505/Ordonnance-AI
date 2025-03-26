import PatientForm from "../components/patientForm";

const PatientFormPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <PatientForm onSubmit={(data) => console.log("Données soumises :", data)} />
    </div>
  );
};

export default PatientFormPage;
