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
  challenge,
  solution,
  outcome,
  labels,
}) => {
  const cardContent = (
    <div className='panel-surface glow-hover p-4 sm:p-5 rounded-2xl w-full sm:w-[360px] h-full'>
      <div className='relative w-full h-[208px] sm:h-[232px]'>
        <img
          src={image}
          alt={name}
          className='w-full h-full object-cover rounded-2xl'
        />

        <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
          <button
            type='button'
            onClick={() => window.open(source_code_link, "_blank")}
            className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer border border-[#7dd3fc66]'
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
        <h3 className='text-white font-bold text-2xl'>{name}</h3>
        <p className='mt-2 text-secondary text-sm leading-7'>{description}</p>
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className={`text-sm ${tag.color}`}
          >
            #{tag.name}
          </p>
        ))}
      </div>

      {challenge && solution && outcome ? (
        <div className='mt-5 rounded-xl border border-[#2ea8ff33] bg-[#121b26] p-3'>
          <p className='text-[12px] text-title uppercase tracking-[0.15em]'>{labels.caseStudy}</p>
          <p className='mt-2 text-[13px] text-[#d8e9fa] leading-6'><span className='font-semibold text-white'>{labels.challenge}:</span> {challenge}</p>
          <p className='mt-1 text-[13px] text-[#d8e9fa] leading-6'><span className='font-semibold text-white'>{labels.solution}:</span> {solution}</p>
          <p className='mt-1 text-[13px] text-[#d8e9fa] leading-6'><span className='font-semibold text-white'>{labels.outcome}:</span> {outcome}</p>
        </div>
      ) : null}
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
  const [tituloDestacados, setTituloDestacados] = useState('Proyectos destacados');
  const [tituloTodos, setTituloTodos] = useState('Todos los proyectos');
  const [caseLabels, setCaseLabels] = useState({
    caseStudy: 'Caso tecnico',
    challenge: 'Problema',
    solution: 'Solucion',
    outcome: 'Resultado',
  });

  const [descripcion, setDescripcion] = useState(`Estos proyectos reflejan mi experiencia construyendo soluciones web, moviles y de escritorio. Incluyen aplicaciones empresariales, herramientas productivas y desarrollos tecnicos que demuestran integracion de tecnologias, enfoque en negocio y capacidad de entrega de extremo a extremo.`);

  const [projects, setProjects] = useState(projectsEs);

  useEffect(() => {

    setTitulo(language !== 'en' ? 'My work' : 'Mi trabajo');
    setSubtitulo(language !== 'en' ? 'Projects.' : 'Proyectos.');
    setTituloDestacados(language !== 'en' ? 'Featured projects' : 'Proyectos destacados');
    setTituloTodos(language !== 'en' ? 'All projects' : 'Todos los proyectos');
    setCaseLabels(
      language !== 'en'
        ? {
            caseStudy: 'Case study',
            challenge: 'Challenge',
            solution: 'Solution',
            outcome: 'Outcome',
          }
        : {
            caseStudy: 'Caso tecnico',
            challenge: 'Problema',
            solution: 'Solucion',
            outcome: 'Resultado',
          }
    );

    setDescripcion(language !== 'en' ? 'These projects reflect my experience building web, mobile, and desktop solutions. They include enterprise applications, productivity tools, and technical developments that demonstrate technology integration, business focus, and end-to-end delivery capability.'
      : 'Estos proyectos reflejan mi experiencia construyendo soluciones web, moviles y de escritorio. Incluyen aplicaciones empresariales, herramientas productivas y desarrollos tecnicos que demuestran integracion de tecnologias, enfoque en negocio y capacidad de entrega de extremo a extremo.');

    setProjects(language !== 'en' ? projectsEn : projectsEs);

  }, [language])

  const featuredProjects = projects.slice(0, 3);
  const allProjects = projects.slice(3);


  return (
    <>
      {!esTelefono ? (
        <>
          <div>
            <p className={`${styles.sectionSubText} `}>{titulo}</p>
            <h2 className={`${styles.sectionHeadText}`}>{subTitulo}</h2>
          </div><div className='w-full flex'>
            <p
              className='mt-6 text-secondary text-base sm:text-xl max-w-5xl leading-8'
            >
              {descripcion}
            </p>
          </div>
          <h3 className='mt-12 text-2xl sm:text-3xl font-bold text-white'>{tituloDestacados}</h3>
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-stretch'>
            {featuredProjects.map((project, index) => (
              <ProjectCard key={`project-${index}`} index={index} labels={caseLabels} {...project} />
            ))}
          </div>
          <h3 className='mt-14 text-2xl sm:text-3xl font-bold text-white'>{tituloTodos}</h3>
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-stretch'>
            {allProjects.map((project, index) => (
              <ProjectCard key={`project-all-${index}`} index={index + featuredProjects.length} labels={caseLabels} {...project} />
            ))}
          </div>
        </>) : (
        <>
          <div>
            <p className={`${styles.sectionSubText} `}>{titulo}</p>
            <h2 className={`${styles.sectionHeadText}`}>{subTitulo}</h2>
          </div><div className='w-full flex'>
            <p
              className='mt-6 text-secondary text-base max-w-5xl leading-7'
            >
              {descripcion}
            </p>
          </div>
          <h3 className='mt-10 text-2xl font-bold text-white'>{tituloDestacados}</h3>
          <div className='mt-5 grid grid-cols-1 gap-7'>
            {featuredProjects.map((project, index) => (
              <ProjectCard key={`project-${index}`} index={index} labels={caseLabels} {...project} />
            ))}
          </div>
          <h3 className='mt-10 text-2xl font-bold text-white'>{tituloTodos}</h3>
          <div className='mt-5 grid grid-cols-1 gap-7'>
            {allProjects.map((project, index) => (
              <ProjectCard key={`project-all-${index}`} index={index + featuredProjects.length} labels={caseLabels} {...project} />
            ))}
          </div>
        </>)}

    </>
  );
};

export default SectionWrapper(Works, "projects");
