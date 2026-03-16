import React from "react";
import { styles } from "../styles";

const Footer = ({ language }) => {
  const isEnglish = language !== "en";
  const year = new Date().getFullYear();

  return (
    <footer className='mt-12 border-t border-[#2ea8ff33] bg-[#0b1119]'>
      <div className={`max-w-screen-2xl mx-auto ${styles.paddingX} py-8 sm:py-10`}>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div>
            <h3 className='text-white text-xl font-bold'>Roberto Esquivel Troncoso</h3>
            <p className='text-secondary text-sm mt-1'>
              {isEnglish
                ? "Full Stack Software Developer | Web, Mobile, Desktop"
                : "Desarrollador Full Stack | Web, Movil, Escritorio"}
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <a className='text-sm text-[#a9e8ff] no-underline hover:text-title' href='#about'>
              {isEnglish ? "About" : "Acerca de"}
            </a>
            <a className='text-sm text-[#a9e8ff] no-underline hover:text-title' href='#work'>
              {isEnglish ? "Experience" : "Experiencia"}
            </a>
            <a className='text-sm text-[#a9e8ff] no-underline hover:text-title' href='#projects'>
              {isEnglish ? "Projects" : "Proyectos"}
            </a>
          </div>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-2'>
          <a className='text-sm text-secondary no-underline hover:text-title' href='https://www.linkedin.com/in/roberto-esquivel-troncoso/' target='_blank' rel='noopener noreferrer'>
            LinkedIn
          </a>
          <a className='text-sm text-secondary no-underline hover:text-title' href='https://github.com/RETBOT/' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
          <a className='text-sm text-secondary no-underline hover:text-title' href='mailto:robertoesquiveltr16@gmail.com'>
            Email
          </a>
          <a className='text-sm text-secondary no-underline hover:text-title' href='/cv/CV_Roberto_Esquivel_Troncoso.pdf' target='_blank' rel='noopener noreferrer'>
            {isEnglish ? "Visual Resume" : "CV Visual"}
          </a>
          <a className='text-sm text-secondary no-underline hover:text-title' href='/cv/CV_Roberto_Esquivel_Troncoso_ATS.html' target='_blank' rel='noopener noreferrer'>
            {isEnglish ? "ATS Resume" : "CV ATS"}
          </a>
        </div>

        <p className='mt-6 text-xs text-[#8fa7be]'>
          {isEnglish
            ? `Copyright ${year}. Built and maintained by Roberto Esquivel Troncoso.`
            : `Copyright ${year}. Sitio desarrollado y mantenido por Roberto Esquivel Troncoso.`}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
