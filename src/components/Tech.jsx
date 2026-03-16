import React from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";


const Tech = ({esTelefono}) => {
  return (
    <div className='flex flex-row flex-wrap justify-center gap-16'>
      {!esTelefono
        ? technologies.map((technology) => (
            <div className='w-40 h-40' key={technology.name}>
              <BallCanvas icon={technology.icon} />
            </div>
          ))
        : technologies.map((technology) => (
            <div
              key={technology.name}
              className='w-24 h-24 bg-white rounded-full p-3 flex items-center justify-center shadow-card'
            >
              <img
                src={technology.icon}
                alt={technology.name}
                className='w-full h-full object-contain'
              />
            </div>
          ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");
