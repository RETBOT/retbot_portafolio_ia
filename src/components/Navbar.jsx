import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../styles";
import { navLinksEn, navLinksEs } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = ({ language, toggleLanguage }) => {

  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [navLinks, setNavLinks] = useState(navLinksEs);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setNavLinks(language !== 'en' ? navLinksEn : navLinksEs)
  }, [language])

  

  return (
    <nav
      className={`${styles.paddingX
        } w-full flex items-center py-5 fixed top-0 z-20 transition-colors duration-300 ${scrolled ? "bg-[#0e131ae8] backdrop-blur-md border-b border-[#2ea8ff33]" : "bg-transparent"
        }`}
    >
      <div className='w-full flex justify-between items-center max-w-full mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt='logo' className='w-9 h-9 object-contain' />
          <p className='text-white text-[20px] font-bold cursor-pointer flex '>
            Roberto&nbsp;<span className='sm:block hidden text-secondary'>&nbsp;|&nbsp;Web · Mobile · Desktop</span>
          </p>
        </Link>
        <ul className='list-none hidden sm:flex flex-row gap-4'>
          {
            navLinks.map((nav) => (
              <li
                key={nav.id}
                
                onClick={() => setActive(nav.id)}
              >
                <a href={`#${nav.id}`} 
                  className={`${active === nav.id ? "text-selected" : "text-no_selected"
                  } hover:text-selected text-[16px] font-medium cursor-pointer no-underline`}
                 >{nav.title}</a>
              </li>
            ))
          }
          <li>
             <a
                href='#idioma'
                role="button"
                className={`text-no_selected hover:text-selected text-[16px] font-medium cursor-pointer no-underline`}
                onClick={(e) => {
                  e.preventDefault(); 
                  toggleLanguage();
                }}
              >
                {language !== 'en' ? 'English' : 'Español'}
              </a>
          </li>
        </ul>
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <button
            type='button'
            className='w-10 h-10 inline-flex items-center justify-center rounded-lg border border-[#2ea8ff44] bg-[#17212dcc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]'
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? "Close menu" : "Open menu"}
            aria-expanded={toggle}
          >
            <img
              src={toggle ? close : menu}
              alt='menu'
              className='w-7 h-7 object-contain'
            />
          </button>

          <div
            className={`${!toggle ? "hidden" : "flex"
              } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-xl border border-[#2ea8ff44]`}
          >
            <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
              {navLinks.map((nav) => (
                 <li
                  key={nav.id}
                  
                  onClick={() => {
                    setActive(nav.id);
                    setToggle(false);
                  }}
                >
                  <a href={`#${nav.id}`} 
                    className={`${active === nav.id ? "text-selected" : "text-no_selected"
                    } hover:text-selected text-[16px] font-medium cursor-pointer no-underline`}
                   >{nav.title}</a>
                </li>
              ))}
              <li>
                <a
                    href='#idioma'
                    role="button"
                    className={`text-no_selected hover:text-selected text-[16px] font-medium cursor-pointer no-underline`}
                    onClick={(e) => {
                      e.preventDefault(); 
                      toggleLanguage();
                      setToggle(false);
                    }}
                  >
                  {language !== 'en' ? 'English' : 'Español'}
                </a>
          </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
