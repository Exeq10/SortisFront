import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function Tarotista({ tarotista }) {
    // eslint-disable-next-line react/prop-types
    const { ratings, name, img } = tarotista;

    // Componente para estrellas
    const RatingStars = () => {
        // eslint-disable-next-line react/prop-types
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        const filledStars = Math.floor(avgRating);
        const halfStar = avgRating % 1 >= 0.5;

        return (
            <div className="flex text-xl md:text-2xl gap-1 md:gap-2">
                {[...Array(5)].map((_, index) => {
                    if (index < filledStars) {
                        return <span key={index} className="star filled text-yellow-500">★</span>;
                    } else if (index === filledStars && halfStar) {
                        return <span key={index} className="star half text-yellow-500">★</span>;
                    } else {
                        return <span key={index} className="star text-gray-300">★</span>;
                    }
                })}
            </div>
        );
    };

    return (
        <div className=" w-auto mt-2  m-auto border-accent border-4 rounded-2xl shadow-md flex flex-col">
            <div className="flex justify-between py-4 px-4">
                <Link to={`/tarotistaProfile/juan`} className=" flex  justify-center items-center h-8 border-2 rounded-xl border-gray-300 px-3 font-cinzel bg-green-700 text-white transition duration-300 hover:bg-highlight hover:text-white">
                    Ver más
                </Link>
                <img src="/logo.png" alt="logo app" className="w-20 h-30" />
            </div>

            <div className="w-full flex justify-center items-center">
                <img 
                    src={img} 
                    alt="" 
                    className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-gray-300"
                />
            </div>

            <div className="flex flex-col justify-center items-center mt-6 px-4 pb-6 pt-4 bg-gradient-to-bl from-accent to-softBlue rounded-t-2xl">
                <h2 className="font-uncial text-xl md:text-2xl text-white">{name}</h2>
                <p className="font-cinzel text-base md:text-lg text-white">Psiquico / Asesor</p>
                
                {/* Rating stars */}
                <div className="mt-4">
                    <RatingStars />
                </div>
                
                {/* Botones responsivos */}
                <div className="w-full flex flex-col md:flex-row gap-4 mt-6 px-2">
                    <Link to={'/selectPlan'} className="flex-1 px-4 py-2 text-sm md:text-base border-2 border-accent font-cinzel rounded-md shadow-md bg-red-600 text-white flex items-center justify-center space-x-2 transition duration-300 hover:bg-green-900 hover:text-white">
                        <FaEnvelope className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Mensaje</span>
                    </Link>
                    <Link to={'/selectPlan'} className="flex-1 px-4 py-2 text-sm md:text-base border-2 border-accent font-cinzel rounded-md shadow-md bg-yellow-500 text-white flex items-center justify-center space-x-2 transition duration-300 hover:bg-green-900 hover:text-white">
                        <FaPhoneAlt className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Llamada</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Tarotista;
