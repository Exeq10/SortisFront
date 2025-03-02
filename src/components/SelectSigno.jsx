import { 
    TbZodiacAries, TbZodiacTaurus, TbZodiacGemini, TbZodiacCancer, TbZodiacLeo, TbZodiacVirgo, 
    TbZodiacLibra, TbZodiacScorpio, TbZodiacSagittarius, TbZodiacCapricorn, TbZodiacAquarius, TbZodiacPisces 
} from "react-icons/tb";

// Lista de signos con nombres e íconos
const zodiacSigns = [
    { name: "Aries", icon: <TbZodiacAries /> },
    { name: "Tauro", icon: <TbZodiacTaurus /> },
    { name: "Géminis", icon: <TbZodiacGemini /> },
    { name: "Cáncer", icon: <TbZodiacCancer /> },
    { name: "Leo", icon: <TbZodiacLeo /> },
    { name: "Virgo", icon: <TbZodiacVirgo /> },
    { name: "Libra", icon: <TbZodiacLibra /> },
    { name: "Escorpio", icon: <TbZodiacScorpio /> },
    { name: "Sagitario", icon: <TbZodiacSagittarius /> },
    { name: "Capricornio", icon: <TbZodiacCapricorn /> },
    { name: "Acuario", icon: <TbZodiacAquarius /> },
    { name: "Piscis", icon: <TbZodiacPisces /> }
];

// eslint-disable-next-line react/prop-types
function SelectSigno({setState}) {



/* funcion que toma el valor de signo y autoriza el cambio de componente */
    const handleSing = (e) => {

        console.log(e);

        setState(true)
        


    }



    return (
        <section className="w-full h-screen flex flex-col justify-end items-center">
            <h1 className="text-center font-cinzel text-3xl max-w-[60%] mt-7 mb-24">
                Seleccione su signo
            </h1>

            {/* Contenedor de signos */}
            <div className="mb-6 px-8 py-4 rounded-tl-[25%] w-screen sm:w-3/4 lg:w-2/4 bg-gradient-to-r from-secundario to-highlight h-full grid grid-cols-3 grid-rows-4 items-center justify-center gap-4">
                {zodiacSigns.map((sign, key) => (
                    <div 
                        key={key} 
                        onClick={()=> handleSing(sign.name)}
                      
                        className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                        <div className="text-3xl text-gray-700">{sign.icon}</div>
                        <p className="text-xs mt-1">{sign.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SelectSigno;
