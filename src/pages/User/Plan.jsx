import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Goback from "../../components/Goback";

function Plan() {
  const { plan } = useParams();
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);

  const user = useSelector((state) => state.user);

  // Establecer el monto según el plan seleccionado
  useEffect(() => {
    const planAmounts = {
      "Plan 5 minutos + 2 free / $14.99": 14.99,
      "Plan 15 minutos + 2 free / $58.99": 58.99,
      "Plan 30 minutos + 2 free / $89.99": 89.99,
    };
    setAmount(planAmounts[decodeURIComponent(plan)] || 0);
  }, [plan]);

  // Cargar el SDK de PayPal
  useEffect(() => {
    const loadPayPalScript = () => {
      if (!window.paypal) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=AeLp0pscZ92wImVEIauH55-QoVaIDLByAW51YziCIUMweUuQAUfpxW15pnnVjxJoaEcqPSL-gedT-lUi&currency=USD&intent=capture`;
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
      } else {
        setSdkReady(true);
      }
    };

    loadPayPalScript();
  }, []);

  // Función para crear la orden en PayPal
  useEffect(() => {
    if (!sdkReady || !window.paypal || !amount || !user?.token) {
      return;  // Esperar hasta que el SDK esté listo, haya un monto y el usuario esté autenticado
    }

    window.paypal
      .Buttons({
        async createOrder(data, actions) {
          try {
            // Crear la orden en el backend
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({ amount }),
            });

            const orderData = await response.json();
            if (orderData.id) {
              return orderData.id;
            } else {
              throw new Error(orderData?.message || "Error al crear la orden");
            }
          } catch (error) {
            setError(error.message);
            throw error;
          }
        },

        async onApprove(data, actions) {
          try {
            const response = await fetch(`/api/orders/${data.orderID}/capture`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            });

            const orderData = await response.json();
            if (orderData?.status === "COMPLETED") {
              alert(`Pago exitoso. ID: ${orderData.id}`);
            } else {
              throw new Error("Error al capturar el pago");
            }
          } catch (error) {
            setError(error.message);
          }
        },

        onError(err) {
          setError(err.message);
        },
      })
      .render("#paypal-button-container");
  }, [sdkReady, amount, user?.token]);

  return (
    <div className="flex flex-col justify-center w-full items-center min-h-screen px-2 py-6">
      <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full items-center max-w-md">
        <h1 className="text-3xl text-accent text-center font-cinzel mb-6">
          Seleccionaste el siguiente plan
        </h1>
        <div className="bg-gradient-to-r border-2 border-accent rounded-md shadow-md text-center text-white text-xl w-full font-cinzel from-accent mt-6 px-4 py-4 to-highlight uppercase">
          {decodeURIComponent(plan)}
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-700 text-lg font-cinzel mb-4">
            El monto a pagar es: <span className="text-accent font-bold">${amount}</span>
          </p>
        </div>
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}
        {sdkReady ? (
          <div id="paypal-button-container" className="mt-6"></div>
        ) : (
          <p>Cargando PayPal...</p>
        )}
        <div className="flex justify-center w-full mt-6">
          <Goback />
        </div>
      </div>
    </div>
  );
}

export default Plan;
