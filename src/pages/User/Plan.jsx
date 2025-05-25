import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Goback from "../../components/Goback";
import Api from "../../utils/API";

import { ToastContainer,toast } from "react-toastify";
function Plan() {
  const { plan } = useParams();
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);

 
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const planAmounts = {
      "Plan 5 minutos + 2 free / $14.99": 14.99,
      "Plan 15 minutos + 2 free / $58.99": 58.99,
      "Plan 30 minutos + 2 free / $89.99": 89.99,
    };

    const planDurations = {
      "Plan 5 minutos + 2 free / $14.99": 7 * 60 * 1000,
      "Plan 15 minutos + 2 free / $58.99": 17 * 60 * 1000,
      "Plan 30 minutos + 2 free / $89.99": 32 * 60 * 1000,
    };

    const decodedPlan = decodeURIComponent(plan);
    setAmount(planAmounts[decodedPlan] || 0);

    // Guardar duración del plan en localStorage (en segundos)
    const durationInMs = planDurations[decodedPlan];
    if (durationInMs) {
      localStorage.setItem("chatDuracionPlan", Math.floor(durationInMs / 1000));
    }
  }, [plan]);

  useEffect(() => {
    const loadPayPalScript = () => {
      if (window.paypal) {
        setSdkReady(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://www.paypal.com/sdk/js?client-id=AeLp0pscZ92wImVEIauH55-QoVaIDLByAW51YziCIUMweUuQAUfpxW15pnnVjxJoaEcqPSL-gedT-lUi&currency=USD&intent=capture";
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => setError("Error al cargar el SDK de PayPal.");
      document.body.appendChild(script);
    };

    loadPayPalScript();
  }, []);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !amount || !user?.token) return;

    if (!document.getElementById("paypal-button-container").childNodes.length) {
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            const cart = {
              email: user?.email,
              totalAmount: amount,
              items: [
                {
                  name: decodeURIComponent(plan),
                  price: amount,
                  quantity: 1,
                  description: "Suscripción de Plan",
                  sku: `PLAN-${amount}`,
                },
              ],
              tarotista: JSON.parse(localStorage.getItem("tarotistaSeleccionado")),
              user: user?._id || user?.id,
            };

            const response = await fetch(`${Api}payments/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({ cart }),
            });

            const orderData = await response.json();
            console.log("Orden creada:", orderData);

            if (orderData?.orderID) return orderData.orderID;
            throw new Error(orderData?.message || "Error al crear la orden");
          } catch (error) {
            setError(error.message);
            throw error;
          }
        },

        onApprove: async (data) => {
          try {
            toast.success("Pago aprobado, procesando captura...");
            const response = await fetch(
              `${Api}payments/orders/${data.orderID}/capture`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            const orderData = await response.json();
            console.log("Resultado de captura:", orderData);

            if (orderData?.payment?.transactionID) {
              toast.success(
                `Pago exitoso. ID de transacción: ${orderData.payment.transactionID}`
              );
              navigate("/pago-exitoso", { state: { orderData } });
            } else {
              throw new Error(
                orderData?.message || "Error al capturar el pago o faltan datos."
              );
            }
          } catch (error) {
            setError(error.message);
            alert(`Error en la captura del pago: ${error.message}`);
          }
        },

        onError: (err) => {
          console.error("Error en PayPal:", err);
          setError("Ocurrió un error al procesar el pago.");
        },
      }).render("#paypal-button-container");
    }
  }, [sdkReady, amount, user?.token, plan, user?.email, navigate]);

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
        <div className="text-center mt-8">
          <p className="text-gray-700 text-lg font-cinzel mb-4">
            El monto a pagar es:{" "}
            <span className="text-accent font-bold">${amount}</span>
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
