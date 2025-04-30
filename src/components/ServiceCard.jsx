import { motion } from 'framer-motion';
import { PayPalButtons } from "@paypal/react-paypal-js";

// eslint-disable-next-line react/prop-types
const ServiceCard = ({ service }) => {
  const handleApprove = () => {
    window.location.href = service.link; // Redirección después del pago
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-xl flex flex-col justify-center items-center rounded-2xl p-6 mb-4 border hover:shadow-2xl transition-all duration-300"
    >
      <h3 className="text-2xl font-semibold text-primario mb-2">{service.name}</h3>
      <p className="text-gray-600 mb-4">
        Precio: <span className="text-accent font-bold">${service.price}</span>
      </p>

      <div className="w-full">
        <PayPalButtons
          // No seteamos fundingSource para permitir tarjetas y PayPal
          style={{ layout: "horizontal", color: "blue", shape: "rect", label: "pay" }}
          fundingSource={undefined} // ¡clave! para que aparezca opción tarjeta
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: service.price.toString() },
                description: service.name,
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(handleApprove);
          }}
          onError={(err) => {
            console.error("Error en el pago:", err);
          }}
        />
      </div>
    </motion.div>
  );
};

export default ServiceCard;
