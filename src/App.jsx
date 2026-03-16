import { useState, useEffect } from 'react'
import { BrowserRouter } from "react-router-dom";

import { About, Experience, Footer, Hero, Navbar, Tech, Works } from "./components";

const App = () => {
  const [language, setLanguage] = useState('en');
  const [esTelefono, setEsTelefono] = useState(false);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  const verificarTamanioPantalla = () => {
    const { innerWidth } = window;
    if (innerWidth <= 768) { // Puedes ajustar este valor según tus necesidades
      setEsTelefono(true);
    } else {
      setEsTelefono(false);
    }
  };

  useEffect(() => {
    verificarTamanioPantalla();
    window.addEventListener('resize', verificarTamanioPantalla);

    return () => {
      window.removeEventListener('resize', verificarTamanioPantalla);
    };
  }, []);

  useEffect(() => {
    const isEnglish = language !== 'en';
    const title = isEnglish
      ? "Roberto Esquivel | Full Stack Software Developer"
      : "Roberto Esquivel | Desarrollador Full Stack";
    const description = isEnglish
      ? "Professional portfolio of Roberto Esquivel Troncoso, Full Stack Developer specialized in web, mobile, and desktop software solutions using .NET, MAUI, Flutter, and SQL Server."
      : "Portafolio profesional de Roberto Esquivel Troncoso, Desarrollador Full Stack especializado en soluciones web, moviles y de escritorio con .NET, MAUI, Flutter y SQL Server.";

    document.title = title;
    document.documentElement.lang = isEnglish ? 'en' : 'es';

    const setMeta = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.setAttribute('content', value);
    };

    setMeta('#meta-description', description);
    setMeta('#og-title', title);
    setMeta('#og-description', description);
    setMeta('#twitter-title', title);
    setMeta('#twitter-description', description);
  }, [language]);

  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className={`bg-hero-pattern bg-cover bg-no-repeat bg-center`}>
          <Navbar language={language} toggleLanguage={toggleLanguage} />
          <Hero language={language} esTelefono={esTelefono} />
        </div>
        <About language={language} />
        <Experience language={language} />
        <Tech esTelefono={esTelefono} />
        <Works language={language} esTelefono={esTelefono} />
        <Footer language={language} />
      </div>
    </BrowserRouter>
  );
}

export default App;
