const tarotistas = [
  {
    name: "Luna Mística",
    email: "luna.mistica@example.com",
    password: "hashed_password_123", // Asegúrate de encriptarlo en la BD
    role: "tarotista",
    bio: "Hola ¿Cómo estás? Soy Luna Mística, desde niña he tenido experiencias sobrenaturales. Mi abuela era terapeuta y me enseñó el arte de las mancias. Así comprendí que hay un universo más allá de lo que percibimos con nuestros ojos.",
    experience: "He ayudado a muchas personas a encontrar su camino, a tomar las decisiones más acertadas para su bienestar emocional. Me caracteriza la sensibilidad y la empatía en mis lecturas. Soy taróloga y coach de relaciones amorosas con más de 30 años de experiencia en el mundo esotérico.",
    rates: 50, // Precio por sesión en dólares, ajusta según necesites
    availability: ["Lunes", "Miércoles", "Viernes"],
    ratings: [5, 4, 5, 5, 4],
    services: [
      "Recuperar la pareja",
      "Ritual para la abundancia",
      "Limpiezas energéticas"
    ],
    img: "/luna.jpg"
  },
  {
    name: "Dana Tarot",
    email: "dana.tarot@example.com",
    password: "hashed_password_123",
    role: "tarotista",
    bio: "Hola, es un placer. Soy Dana, maestra holística y terapeuta de desarrollo emocional. He sanado varias heridas a lo largo de mi vida. Sé que no es fácil, pero se puede con mucho trabajo. Estas experiencias me hicieron reconocer al ser humano como un todo. Somos energía y ella nunca se pierde.",
    experience: "Tengo más de 15 años de experiencia en el mundo de lo invisible, guiando a las personas en su desarrollo personal y espiritual. Enseño técnicas de meditación a través de la respiración y las gemas.",
    rates: 40,
    availability: ["Martes", "Jueves", "Sábado"],
    ratings: [5, 3, 4, 2, 5],
    services: [
      "Recuperar la pareja",
      "Ritual para la abundancia",
      "Limpiezas energéticas"
    ],
    img: "/danna.jpg"
  },
  {
    name: "Cristian Psíquico",
    email: "cristian.psiquico@example.com",
    password: "hashed_password_123",
    role: "tarotista",
    bio: "Hola, es un gusto. Soy Cristian y estoy encantado de conocerte. Desde niño he tenido sueños premonitorios. Al principio pensaba que había algo malo en mí, hasta que conocí a mi maestro holístico y me enseñó a interpretar los sueños. Me percaté de que tenía un don, que fui desarrollando con el tiempo.",
    experience: "Poseo 20 años de experiencia en el mundo esotérico. He tenido el placer de ayudar a muchas personas a encontrar su camino, su vocación y el amor. Solo soy un canal donde se expresa la divinidad y el universo.",
    rates: 45,
    availability: ["Lunes", "Jueves", "Domingo"],
    ratings: [4, 5, 5, 4, 5],
    services: [
      "Recuperar la pareja",
      "Ritual para la abundancia",
      "Limpiezas energéticas"
    ],
    img: "/cristian.jpg"
  }
];

export default tarotistas;
