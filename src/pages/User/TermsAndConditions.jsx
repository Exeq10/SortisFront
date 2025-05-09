import { motion } from "framer-motion";
import Goback from "../../components/Goback";

const terms = [
  {
    title: "1. Aceptación de Términos",
    description:
      "Al utilizar la plataforma Sortis Tarot, aceptas plenamente estos Términos y Condiciones. Si no estás de acuerdo, te solicitamos no utilizar nuestros servicios.",
  },
  {
    title: "2. Edad Mínima",
    description:
      "El acceso a Sortis Tarot está permitido solo para personas mayores de 18 años. Al usar la plataforma, declaras cumplir con este requisito.",
  },
  {
    title: "3. Naturaleza del Servicio",
    description:
      "Sortis Tarot brinda lecturas de tarot con fines espirituales y de autoconocimiento. No ofrecemos asesoramiento médico, psicológico, legal ni financiero. Tampoco realizamos predicciones sobre juegos de azar ni procesos judiciales.",
  },
  {
    title: "4. Situaciones de Riesgo",
    description:
      "Si se detectan pensamientos de autolesión o de dañar a otros, se recomendará buscar ayuda profesional urgente y contactar al 911. Sortis Tarot no reemplaza la intervención de profesionales de la salud mental.",
  },
  {
    title: "5. Responsabilidad del Usuario",
    description:
      "Las decisiones basadas en las lecturas de tarot son responsabilidad exclusiva del usuario. Sortis brinda orientación espiritual, sin garantizar resultados.",
  },
  {
    title: "6. Ética Profesional",
    description:
      "Los psíquicos de Sortis Tarot actúan con ética, respeto, confidencialidad y buena disposición hacia cada consultante.",
  },
  {
    title: "7. Pagos y Confidencialidad",
    description:
      "Los pagos se realizan mediante plataformas seguras. Toda información personal se trata con confidencialidad, conforme a la normativa vigente.",
  },
  {
    title: "8. Protección de Datos Personales",
    description:
      "Sortis cumple con el Reglamento General de Protección de Datos (UE) 2016/679 y la Ley 18.331 de Uruguay. Podés ejercer tus derechos sobre tus datos escribiendo a sortistarot@gmail.com.",
  },
  {
    title: "9. Comunicaciones y Reclamos",
    description:
      "Para consultas, sugerencias o reclamos, escribinos a sortistarot@gmail.com. También podés solicitar dejar de recibir mensajes promocionales.",
  },
  {
    title: "10. Jurisdicción",
    description:
      "Ante cualquier disputa legal, serán competentes los tribunales de la República Oriental del Uruguay.",
  },
  {
    title: "11. Modificaciones",
    description:
      "Sortis Tarot puede modificar estos Términos en cualquier momento. Las actualizaciones se comunicarán en la web y se entenderán aceptadas si continuás usando nuestros servicios.",
  },
];

const TermsAndConditions = () => {
  return (
    <div className="w-[90%] max-w-4xl mx-auto mt-30 mb-16">
      <motion.h1
        className="text-3xl font-cinzel text-center text-primario mb-8"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Términos y Condiciones de Uso – Sortis Tarot
      </motion.h1>

      <div className="space-y-8">
        {terms.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/80 rounded-2xl shadow-md p-4 md:p-6 border-l-4 border-accent"
          >
            <h2 className="text-lg font-semibold text-accent mb-2">{item.title}</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-gray-500">
        Para consultas o reclamos, escribinos a{" "}
        <a href="mailto:sortistarot@gmail.com" className="text-primario underline">
          sortistarot@gmail.com
        </a>
        .
      </p>
      <Goback />
    </div>
  );
};

export default TermsAndConditions;
