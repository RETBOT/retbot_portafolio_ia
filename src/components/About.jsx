import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn("right", "spring", index * 0.5, 0.75)}
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 280, damping: 18 }}
    className="xs:w-[250px] w-full green-pink-gradient p-[1px] rounded-[20px] border-[1.5px] shadow-card"
  >
    <div className="bg-tertiary rounded-[20px] border-[1.5px] py-5 px-12 min-h-[300px] flex justify-evenly items-center flex-col">
      <img
        src={icon}
        alt="web-development"
        className="w-16 h-16 object-contain"
      />

      <h3 className="text-white text-[20px] font-bold text-center">
        {title}
      </h3>
    </div>
  </motion.div>
);


const About = ({ language }) => {
  const [titulo, setTitulo] = useState('Introducción');
  const [subTitulo, setSubTitulo] = useState('Descripción general')
  const [descripcion, setDescripcion] =
    useState(`Desarrollador Full Stack especializado en soluciones administrativas y ERP. Cuento con experiencia en desarrollo, mantenimiento y mejora de sistemas usando .NET, C#, .NET MAUI, Flutter, SQL Server y arquitectura basada en APIs REST. Mi enfoque combina calidad técnica, optimización de procesos y entrega de valor continuo al negocio.`)
  useEffect(() => {
    setTitulo(language !== 'en' ? 'Introduction' : 'Introducción');
    setSubTitulo(language !== 'en' ? 'Overview' : 'Descripción general');
    setDescripcion(language !== 'en' 
    ? `Full Stack Developer specialized in administrative and ERP solutions. I have experience developing, maintaining, and improving systems using .NET, C#, .NET MAUI, Flutter, SQL Server, and REST API-based architecture. My approach combines technical quality, process optimization, and continuous business value delivery.` 
    : `Desarrollador Full Stack especializado en soluciones administrativas y ERP. Cuento con experiencia en desarrollo, mantenimiento y mejora de sistemas usando .NET, C#, .NET MAUI, Flutter, SQL Server y arquitectura basada en APIs REST. Mi enfoque combina calidad técnica, optimización de procesos y entrega de valor continuo al negocio.`
    )
  }, [language]);

  

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{titulo}</p>
        <h2 className={styles.sectionHeadText}>{subTitulo}</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-6xl leading-[30px]'
      >
        {descripcion}

      </motion.p>

      <div className='mt-20 flex flex-wrap gap-20 justify-center items-center '>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
