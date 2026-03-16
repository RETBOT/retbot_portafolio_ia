import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projectsEn, projectsEs } from "../constants";
import { fadeIn } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  icon,
  source_code_link,
}) => {
  const cardContent = (
    <div className='bg-tertiary p-4 sm:p-5 rounded-2xl w-full sm:w-[360px] h-full'>
      <div className='relative w-full h-[210px] sm:h-[230px]'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover rounded-2xl'
        />

        <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
          <button
            type='button'
            onClick={() => window.open(source_code_link, "_blank")}
            className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer border-0'
            aria-label={`Open ${name}`}
          >
            <img
              src={icon}
              alt='project link'
              className='w-1/2 h-1/2 object-contain'
            />
          </button>
        </div>
      </div>

      <div className='mt-5'>
        <h3 className='text-white font-bold text-[22px] sm:text-[24px]'>{name}</h3>
        <p className='mt-2 text-secondary text-[14px] leading-6'>{description}</p>
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className={`text-[14px] ${tag.color}`}
          >
            #{tag.name}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.12, 0.65)}
      initial='hidden'
      whileInView='show'
      viewport={{ once: false, amount: 0.18 }}
      className='h-full'
    >
      {cardContent}
    </motion.div>
  );
};

const Works = ({ language, esTelefono }) => {
  const [titulo, setTitulo] = useState('Mi trabajo');
  const [subTitulo, setSubtitulo] = useState('Proyectos');

  const [descripcion, setDescripcion] = useState(`A continuación, se presentan algunos proyectos que muestran mis habilidades y experiencia a través de ejemplos concretos de mi trabajo. Cada proyecto se describe brevemente y se incluyen enlaces a repositorios de código y demostraciones en vivo. Estos proyectos reflejan mi capacidad para resolver problemas complejos, trabajar con diversas tecnologías y gestionar proyectos de manera efectiva.`);

  const [projects, setProjects] = useState(projectsEs);

  useEffect(() => {

    setTitulo(language !== 'en' ? 'My work' : 'Mi trabajo');
    setSubtitulo(language !== 'en' ? 'Projects.' : 'Proyectos.');

    setDescripcion(language !== 'en' ? 'The following projects showcase my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos. It reflects my ability to solve complex problems, work with different technologies, and manage projects effectively.'
      : 'A continuación, se presentan algunos proyectos que muestran mis habilidades y experiencia a través de ejemplos concretos de mi trabajo. Cada proyecto se describe brevemente y se incluyen enlaces a repositorios de código y demostraciones en vivo. Estos proyectos reflejan mi capacidad para resolver problemas complejos, trabajar con diversas tecnologías y gestionar proyectos de manera efectiva.');

    setProjects(language !== 'en' ? projectsEn : projectsEs);

  }, [language])


  return (
    <>
      {!esTelefono ? (
        <>
          <div>
            <p className={`${styles.sectionSubText} `}>{titulo}</p>
            <h2 className={`${styles.sectionHeadText}`}>{subTitulo}</h2>
          </div><div className='w-full flex'>
            <p
              className='mt-6 text-secondary text-[16px] sm:text-[20px] max-w-5xl leading-[30px]'
            >
              {descripcion}
            </p>
          </div><div className='mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-stretch'>
            {projects.map((project, index) => (
              <ProjectCard key={`project-${index}`} index={index} {...project} />
            ))}
          </div>
        </>) : (
        <>
          <div>
            <p className={`${styles.sectionSubText} `}>{titulo}</p>
            <h2 className={`${styles.sectionHeadText}`}>{subTitulo}</h2>
          </div><div className='w-full flex'>
            <p
              className='mt-6 text-secondary text-[16px] sm:text-[20px] max-w-5xl leading-[30px]'
            >
              {descripcion}
            </p>
          </div><div className='mt-10 grid grid-cols-1 gap-7'>
            {projects.map((project, index) => (
              <ProjectCard key={`project-${index}`} index={index} {...project} />
            ))}
          </div>
        </>)}

    </>
  );
};

export default SectionWrapper(Works, "");
