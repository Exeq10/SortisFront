

import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';


// eslint-disable-next-line react/prop-types
function Tarotista({tarotista}) {

    // eslint-disable-next-line react/prop-types
    const {ratings, name,img} = tarotista;

    console.log(ratings);

    // Componente para estrellas
    const RatingStars = () => {
        // eslint-disable-next-line react/prop-types
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const filledStars = Math.floor(avgRating); // Número entero de estrellas completas
        const halfStar = avgRating % 1 >= 0.5; // Verifica si es necesario agregar media estrella

        return (
            <div className="flex text-3xl gap-2">
                {[...Array(5)].map((_, index) => {
                    if (index < filledStars) {
                        return <span key={index} className="star filled text-yellow-500">★</span>; // Estrella completa
                    } else if (index === filledStars && halfStar) {
                        return <span key={index} className="star half text-yellow-500">★</span>; // Media estrella
                    } else {
                        return <span key={index} className="star text-gray-300">★</span>; // Estrella vacía
                    }
                })}
            </div>
        );
    };

    return (
        <div className="w-[90%] m-auto border-accent border-4 rounded-2xl shadow-md flex flex-col">
            <div className="flex justify-between py-4 px-4">
                <button className="h-8 border-2 rounded-2xl border-gray-300 px-3 font-cinzel bg-green-700 text-white transition duration-300 hover:bg-gray-500 hover:text-black">
                    Ver más
                </button>
                <img src="/logo.png" alt="logo app" className="w-20 h-30" />
            </div>

            <div className="w-full flex justify-center items-center">
                <img 
                    src={img} 
                    alt="" 
                    className="w-[150px] h-[150px] rounded-full bg-gray-300"
                />
            </div>

            <div className="flex flex-col justify-center items-center mt-10 px-4 pb-10 pt-4 bg-gradient-to-bl from-accent to-softBlue rounded-t-4xl">
                <h2 className="font-uncial text-2xl text-white">{name} </h2>
                <p className="font-cinzel text-lg text-white">Psiquico / Asesor</p>

                {/* Rating stars */}
                <div className="mt-4">
                    <RatingStars />
                </div>

                <div className="w-full flex  justify-between px-4 mt-6">
                <Link to={'/selectPlan'} className="px-6 py-2 border-2 border-accent font-cinzel rounded-md shadow-md bg-red-600 text-white flex items-center space-x-2 transition duration-300 hover:bg-green-900 hover:text-white">
                        <FaEnvelope className="w-5 h-5" />
                        <span>Mensaje</span>
                    </Link>
                    <Link to={'/selectPlan'} className="px-6 py-2 border-2 border-accent font-cinzel rounded-md shadow-md bg-yellow-500 text-white flex items-center space-x-2 transition duration-300 hover:bg-green-900 hover:text-white">
                        <FaPhoneAlt className="w-5 h-5" />
                        <span>Llamada</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Tarotista;
