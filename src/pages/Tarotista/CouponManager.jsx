import { useEffect, useState } from "react";
import { FaGift, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Goback from "../../components/Goback";
import Api from "../../utils/API";
import axios from "axios";

function CouponManager() {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    minutes: "",
    expiresAt: "",
  });

  // Cargar cupones existentes
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${Api}coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error("Error al cargar cupones:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        minutes: parseInt(minutes),
        expiresAt: expiryDate,
      };

      await axios.post(`${Api}coupons`, payload);
      setMessage("✅ Cupón creado correctamente");
      setName("");
      setMinutes("");
      setExpiryDate("");
      fetchCoupons();
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al crear el cupón");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cupón?")) return;
    try {
      await axios.delete(`${Api}coupons/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error("Error al eliminar cupón:", error);
    }
  };

  const handleEdit = (coupon) => {
    setEditId(coupon._id);
    setEditData({
      name: coupon.name,
      minutes: coupon.minutes,
      expiresAt: coupon.expiresAt.slice(0, 10), // solo fecha
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${Api}coupons/${editId}`, {
        ...editData,
        minutes: parseInt(editData.minutes),
      });
      setEditId(null);
      fetchCoupons();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[60%] m-auto px-6 mt-10">
      <h1 className="font-cinzel text-3xl text-center text-primario mb-6">
        Administrar cupones <FaGift className="inline ml-2" />
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <input
          type="text"
          placeholder="Nombre del cupón"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-2 rounded-md px-3 py-2"
        />

        <input
          type="number"
          placeholder="Minutos gratis"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          required
          className="border-2 rounded-md px-3 py-2"
        />

        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
          className="border-2 rounded-md px-3 py-2"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-softBlue to-accent text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          Crear cupón
        </button>
      </form>

      {message && <p className="text-center mt-4">{message}</p>}

      <h2 className="text-xl font-semibold mb-4">Cupones actuales</h2>

      <div className="flex flex-col gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="border-2 border-accent p-4 rounded-md shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            {editId === coupon._id ? (
              <div className="flex flex-col gap-2 w-full md:flex-row md:items-center">
                <input
                  className="border px-2 py-1 rounded w-full md:w-1/3"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-full md:w-1/4"
                  value={editData.minutes}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      minutes: e.target.value,
                    }))
                  }
                />
                <input
                  type="date"
                  className="border px-2 py-1 rounded w-full md:w-1/3"
                  value={editData.expiresAt}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                />
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={handleSaveEdit} className="text-green-600">
                    <FaSave />
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2">
                <p>
                  <strong>{coupon.name}</strong> — {coupon.minutes} min —{" "}
                  {new Date(coupon.expiresAt).toLocaleDateString()}
                </p>
                <div className="flex gap-3 text-xl">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="text-blue-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Goback />
      </div>
    </div>
  );
}

export default CouponManager;
