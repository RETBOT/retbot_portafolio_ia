import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { textVariant } from "../utils/motion";
import { styles } from "../styles";

const Tech = ({ esTelefono, language }) => {
  const scrollRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [itemsPerDot, setItemsPerDot] = useState(3);

  const isEnglish = language !== "en";
  const subTitulo = isEnglish ? "Technologies" : "Tecnologías";
  const titulo = isEnglish ? "My stack." : "Mi stack.";

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setScrollLeft(el.scrollLeft);
      const max = el.scrollWidth - el.clientWidth;
      setMaxScroll(max);

      const containerWidth = el.clientWidth;
      setItemsPerDot(containerWidth < 380 ? 2 : 3);
    };

    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const getCardStep = () => {
    const el = scrollRef.current;
    if (!el || !el.children.length) return 130;
    const firstCard = el.children[0];
    return firstCard.offsetWidth + 16;
  };

  const totalDots = Math.max(1, Math.ceil(technologies.length / itemsPerDot));

  const currentDot = (() => {
    const step = getCardStep();
    if (step <= 0) return 0;
    const pos = scrollLeft / (step * itemsPerDot);
    return Math.min(Math.round(pos), totalDots - 1);
  })();

  const scrollToDot = (dotIndex) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getCardStep();
    const targetScroll = dotIndex * step * itemsPerDot;
    el.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const hasOverflow = maxScroll > 5;
  const atStart = scrollLeft <= 10;
  const atEnd = scrollLeft >= maxScroll - 10;

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>{subTitulo}</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>{titulo}</h2>
      </motion.div>

      {!esTelefono ? (
        <div className="flex flex-row flex-wrap justify-center gap-16 mt-12">
          {technologies.map((technology) => (
            <div className="w-40 h-40" key={technology.name}>
              <BallCanvas icon={technology.icon} />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative mt-10">
          {/* Left gradient fade */}
          {hasOverflow && !atStart && (
            <div
              className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0E131A] to-transparent z-10 pointer-events-none"
              style={{ height: "calc(100% - 8px)" }}
            />
          )}

          {/* Right gradient fade */}
          {hasOverflow && !atEnd && (
            <div
              className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0E131A] to-transparent z-10 pointer-events-none"
              style={{ height: "calc(100% - 8px)" }}
            />
          )}

          {/* Carousel */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-2 scrollbar-hide"
          >
            {technologies.map((technology) => (
              <div
                key={technology.name}
                className="snap-center flex-shrink-0 w-[110px]"
              >
                <div className="panel-surface rounded-2xl p-4 flex flex-col items-center gap-3 glow-hover min-h-[130px]">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img
                      src={technology.icon}
                      alt={technology.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-white text-[11px] font-medium text-center leading-tight">
                    {technology.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {totalDots > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {[...Array(totalDots)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToDot(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentDot
                      ? "w-6 bg-[#22d3ee]"
                      : "w-2 bg-white/20"
                  }`}
                  aria-label={
                    isEnglish ? `Go to group ${i + 1}` : `Ir al grupo ${i + 1}`
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SectionWrapper(Tech, "");
