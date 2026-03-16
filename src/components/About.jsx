import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn("right", "spring", index * 0.25, 0.65)}
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 280, damping: 18 }}
    className="xs:w-[250px] w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card glow-hover"
  >
    <div className="panel-surface rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
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
    useState(`Desarrollador de software Full Stack con enfoque tecnico-profesional en aplicaciones web, moviles y de escritorio. He participado en el desarrollo, mantenimiento e integracion de soluciones empresariales con .NET, C#, .NET MAUI, Flutter, SQL Server y APIs REST, priorizando arquitectura limpia, estabilidad operativa y escalabilidad. Mi objetivo es transformar requerimientos de negocio en productos confiables, mantenibles y con impacto real en la operacion.`)
  useEffect(() => {
    setTitulo(language !== 'en' ? 'Introduction' : 'Introducción');
    setSubTitulo(language !== 'en' ? 'Overview' : 'Descripción general');
    setDescripcion(language !== 'en' 
    ? `Full Stack Software Developer with a technical-professional approach to web, mobile, and desktop applications. I have worked on development, maintenance, and integration of enterprise solutions using .NET, C#, .NET MAUI, Flutter, SQL Server, and REST APIs, with a strong focus on clean architecture, operational stability, and scalability. My goal is to convert business requirements into reliable, maintainable products with measurable operational impact.` 
    : `Desarrollador de software Full Stack con enfoque tecnico-profesional en aplicaciones web, moviles y de escritorio. He participado en el desarrollo, mantenimiento e integracion de soluciones empresariales con .NET, C#, .NET MAUI, Flutter, SQL Server y APIs REST, priorizando arquitectura limpia, estabilidad operativa y escalabilidad. Mi objetivo es transformar requerimientos de negocio en productos confiables, mantenibles y con impacto real en la operacion.`
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
        className='mt-4 text-secondary text-[16px] sm:text-[18px] max-w-6xl leading-[32px]'
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
