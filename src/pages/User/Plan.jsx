import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Goback from "../../components/Goback";
import Api from "../../utils/API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Plan() {
  const { plan } = useParams();
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [cuponesActivos, setCuponesActivos] = useState([]);
  const [cuponSeleccionado, setCuponSeleccionado] = useState(null);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const planData = {
    "Plan 5 minutos + 2 free / $9.99": { amount: 9.99, duration: 7 * 60 * 1000 },
    "Plan 15 minutos + 2 free / $19.99": { amount: 19.99, duration: 17 * 60 * 1000 },
    "Plan 30 minutos + 2 free / $34.99": { amount: 34.99, duration: 32 * 60 * 1000 },
  };

  useEffect(() => {
    const decodedPlan = decodeURIComponent(plan);
    const selectedPlan = planData[decodedPlan];
    if (selectedPlan) {
      setAmount(selectedPlan.amount);
      const duracionBaseSegundos = Math.floor(selectedPlan.duration / 1000);
      localStorage.setItem("chatDuracionPlanBase", duracionBaseSegundos);

      const extraSegundos = (cuponSeleccionado?.minutes || 0) * 60;
      localStorage.setItem("chatDuracionPlan", duracionBaseSegundos + extraSegundos);
    }
  }, [plan, cuponSeleccionado]);

  useEffect(() => {
    const fetchCupones = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`${Api}coupons/available/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setCuponesActivos(data);
      } catch (err) {
        console.error("Error al obtener cupones:", err);
      }
    };
    fetchCupones();
  }, [user]);

  useEffect(() => {
    const loadPayPalScript = () => {
      const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_APP_PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => setError("Error al cargar el SDK de PayPal.");
      document.body.appendChild(script);
    };
    loadPayPalScript();
  }, []);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !amount || !user?.token) return;
    if (document.getElementById("paypal-button-container").childNodes.length) return;

    window.paypal.Buttons({
      createOrder: async () => {
        const cart = {
          email: user?.email,
          totalAmount: amount,
          items: [{
            name: decodeURIComponent(plan),
            price: amount,
            quantity: 1,
            description: "Suscripción de Plan",
            sku: `PLAN-${amount}`,
          }],
          tarotista: JSON.parse(localStorage.getItem("tarotistaSeleccionado")),
          user: user._id || user.id,
        };

        const res = await fetch(`${Api}payments/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ cart }),
        });
        const orderData = await res.json();
        if (!orderData?.orderID) throw new Error(orderData.message || "Error al crear la orden");

        // guardamos cart para luego enviarlo en capture
        localStorage.setItem("lastCart", JSON.stringify(cart));
        return orderData.orderID;
      },
      onApprove: async (data) => {
        toast.success("Pago aprobado, procesando...");

        const cart = JSON.parse(localStorage.getItem("lastCart"));

        const captureRes = await fetch(`${Api}payments/orders/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ orderID: data.orderID, cart }), // enviamos orderID + cart
        });
        const captureData = await captureRes.json();
        if (!captureData?.payment?.transactionID) throw new Error("Error al capturar el pago.");

        const duracionBase = parseInt(localStorage.getItem("chatDuracionPlanBase")) || 0;
        const minutosCupon = cuponSeleccionado?.minutes || 0;
        const tiempoFinal = Math.floor(duracionBase / 60) + minutosCupon;

        const tarotistaSeleccionado = JSON.parse(localStorage.getItem("tarotistaSeleccionado"));

        const sessionRes = await fetch(`${Api}sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            usuario: user._id,
            tarotista: tarotistaSeleccionado._id,
            tiempoPlan: tiempoFinal,
          }),
        });
        const sessionData = await sessionRes.json();

        toast.success(`Pago exitoso. ID transacción: ${captureData.payment.transactionID}`);
        navigate("/pago-exitoso", { state: { orderData: captureData, sessionData } });
      },
      onError: (err) => {
        console.error("Error en PayPal:", err);
        setError("Ocurrió un error al procesar el pago.");
      },
    }).render("#paypal-button-container");
  }, [sdkReady, amount, user?.token, plan, user?.email, navigate, cuponSeleccionado]);

  return (
    <div className="flex flex-col justify-center w-full items-center min-h-screen px-2 py-6">
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full items-center max-w-md">
        <ToastContainer />
        <h1 className="text-3xl text-accent text-center font-cinzel mb-6">
          Seleccionaste el siguiente plan
        </h1>
        <div className="bg-gradient-to-r border-2 border-accent rounded-md shadow-md text-center text-white text-xl w-full font-cinzel from-accent mt-6 px-4 py-4 to-highlight uppercase">
          {decodeURIComponent(plan)}
        </div>

        {cuponesActivos.length > 0 && (
          <div className="mt-6 w-full">
            <h2 className="text-xl font-semibold mb-2 text-center text-accent">
              Tus cupones activos
            </h2>
            <ul className="flex flex-col gap-2 max-h-40 overflow-auto px-2">
              {cuponesActivos.map((cupon) => (
                <li
                  key={cupon._id}
                  className="flex items-center justify-between border rounded p-2 cursor-pointer hover:bg-gray-100"
                  onClick={async () => {
                    try {
                      const res = await fetch(`${Api}coupons/${cupon.name}/apply`, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${user.token}`,
                        },
                        body: JSON.stringify({ userId: user._id }),
                      });
                      if (!res.ok) throw new Error("Error al aplicar el cupón");
                      setCuponSeleccionado(cupon);
                      setCuponesActivos((prev) => prev.filter((c) => c._id !== cupon._id));
                      toast.success(`🎉 Cupón "${cupon.name}" aplicado con éxito`);
                    } catch (err) {
                      console.error(err);
                      toast.error("❌ No se pudo aplicar el cupón");
                    }
                  }}
                >
                  <div>
                    <p className="font-semibold">{cupon.name}</p>
                    <p className="text-sm text-gray-600">{cupon.minutes} minutos extra</p>
                    <p className="text-xs text-gray-400">
                      Vence: {new Date(cupon.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="cupon"
                    checked={cuponSeleccionado?._id === cupon._id}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {cuponSeleccionado && (
          <p className="mt-4 text-green-600 text-center">
            🎁 Aplicarás <b>{cuponSeleccionado.minutes}</b> minutos extra con el cupón <b>{cuponSeleccionado.name}</b>.
          </p>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-700 text-lg font-cinzel mb-4">
            El monto a pagar es: <span className="text-accent font-bold">${amount}</span>
          </p>
        </div>

        {sdkReady ? (
          <div id="paypal-button-container" className="mt-6"></div>
        ) : (
          <p>Cargando PayPal...</p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="flex justify-center w-full mt-6">
          <Goback />
        </div>
      </div>
    </div>
  );
}

export default Plan;
