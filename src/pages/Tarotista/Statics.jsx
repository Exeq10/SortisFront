import axios from "axios";
import { useEffect, useState } from "react";
import Api from "../../utils/API";
import { useSelector } from "react-redux";

const Statics = () => {
  const [ingresos, setIngresos] = useState([]);
  const [filteredIngresos, setFilteredIngresos] = useState([]);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const token = useSelector((state) => state.tarotista.token);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const res = await axios.get(`${Api}stats/ingresos-mensuales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIngresos(res.data);
        setFilteredIngresos(res.data);
      } catch (err) {
        setError("No se pudieron cargar las estadísticas");
        console.error(err);
      }
    };

    fetchIngresos();
  }, [token]);

  const handleFilter = () => {
    const filtrado = ingresos.filter((item) => {
      return (
        (selectedMonth === "" || item.month === parseInt(selectedMonth)) &&
        (selectedYear === "" || item.year === parseInt(selectedYear))
      );
    });
    setFilteredIngresos(filtrado);
  };

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl text-center mb-4 font-bold font-cinzel text-accent">
        Mis Ingresos Mensuales
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-md shadow-md border border-gray-300 font-cinzel"
        >
          <option value="">Todos los meses</option>
          {months.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Año"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-3 py-2 rounded-md shadow-md border border-gray-300 font-cinzel"
        />

        <button
          onClick={handleFilter}
          className="bg-accent text-white px-4 py-2 rounded-md shadow-md hover:scale-105 duration-200 font-cinzel"
        >
          Filtrar
        </button>
      </div>

      {/* Tarjetas de ingresos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredIngresos.length > 0 ? (
          filteredIngresos.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-xl p-4 border-l-4 border-accent"
            >
              <h3 className="text-lg font-semibold font-cinzel text-gray-800 mb-2">
                {months[item.month - 1]} {item.year}
              </h3>
              <p className="text-gray-700 font-cinzel">
                Total: <span className="font-bold text-accent">${item.totalAmount.toFixed(2)}</span>
              </p>
              <p className="text-gray-700 font-cinzel">
                Pagos recibidos: <span className="font-bold">{item.totalPagos}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 font-cinzel">No hay datos para los filtros seleccionados.</p>
        )}
      </div>
    </div>
  );
};

export default Statics;
