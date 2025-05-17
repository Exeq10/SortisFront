// components/WidgetUltimoPago.js
import { useEffect, useState } from "react";
import axios from "axios";
import Api from "../utils/API";
import { useSelector } from "react-redux";
import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const WidgetUltimoPago = () => {
  const [ultimo, setUltimo] = useState(null);
  const token = useSelector((state) => state.tarotista.token);

  useEffect(() => {
    const fetchUltimoPago = async () => {
      try {
        const res = await axios.get(`${Api}stats/ingresos-mensuales`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ingresos = res.data;
        if (ingresos.length > 0) {
          const ultimo = ingresos.reduce((a, b) => {
            const dateA = new Date(a.year, a.month - 1);
            const dateB = new Date(b.year, b.month - 1);
            return dateB > dateA ? b : a;
          });
          setUltimo(ultimo);
        }
      } catch (err) {
        console.error("Error cargando el último ingreso", err);
      }
    };

    fetchUltimoPago();
  }, [token]);

  if (!ultimo) return null;

  return (
    <div className="mt-6 bg-gradient-to-r from-softBlue to-accent rounded-xl shadow-lg px-6 py-4 w-full max-w-xs text-white">
      <div className="flex items-center gap-3 mb-2">
        <PiCurrencyDollarSimpleDuotone className="text-3xl" />
        <h3 className="text-lg font-cinzel font-semibold">Total generado  </h3>
      </div>
      <p className="text-sm font-cinzel">{months[ultimo.month - 1]} {ultimo.year}</p>
      <p className="text-lg font-bold font-cinzel mt-1">
        ${ultimo.totalAmount.toFixed(2)}
      </p>
    </div>
  );
};

export default WidgetUltimoPago;
