import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Lundi", consultations: 5 },
  { name: "Mardi", consultations: 8 },
  { name: "Mercredi", consultations: 6 },
  { name: "Jeudi", consultations: 10 },
  { name: "Vendredi", consultations: 7 },
];

const ConsultationChart = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Consultations par jour</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="consultations" fill="#4F46E5" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsultationChart;
