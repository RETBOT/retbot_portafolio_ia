# CV Web - Roberto Esquivel Troncoso

Este proyecto es mi CV web y portafolio profesional.

Actualmente estoy utilizando **Open Code** para potenciar y mejorar continuamente mi CV, incluyendo:

- mejoras de contenido (experiencia, proyectos y descripciones),
- optimizacion de estilos CSS y experiencia responsive,
- correccion de detalles tecnicos y estabilidad en dispositivos moviles.

## Tecnologias principales

- React
- Vite
- Tailwind CSS
- Three.js / React Three Fiber

## Objetivo

Mantener un CV web moderno, estable y en constante evolucion para reflejar mi crecimiento profesional.

## Agente interno de automatizacion

Este repositorio incluye un agente interno para automatizar QA, validaciones de contenido y flujo de Pull Request.

Comandos disponibles:

- `yarn run agent:qa` valida build y estructura base del CV.
- `yarn run agent:content` valida proyectos, descripciones y links.
- `yarn run agent:pr` ejecuta QA + contenido + commit/push + PR con comentario automatico.
- `yarn run agent:run` ejecuta el flujo completo (equivale al modo todo en uno).

## UI/UX AI Agent global

Tambien se incluye un agente global de UI/UX para analizar y mejorar interfaces en este u otros proyectos.

- `yarn run uiux:agent --target "<ruta-del-proyecto>" --mode all --format both --pr-comment`
- `yarn run uiux:self` para analizar este proyecto.

Documentacion completa en `UIUX_AGENT.md`.
