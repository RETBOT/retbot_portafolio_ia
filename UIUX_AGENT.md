# UI/UX AI Agent

Agente global para analizar, mejorar y evaluar interfaces visuales en distintos proyectos y tecnologias.

## Objetivo

Elevar la calidad visual y UX de una interfaz con analisis automatico, recomendaciones accionables y sugerencias de codigo.

## Capacidades

- Analisis de UI en codigo:
  - jerarquia visual
  - espaciado
  - tipografia
  - layout
  - accesibilidad
  - consistencia
- Analisis de screenshots (insight de viewport y metadata visual base)
- Recomendaciones de diseno priorizadas (high/medium/low)
- Sugerencias de codigo mejorado
- UX Score global y por categoria
- Generacion opcional de comentario para PR

## Arquitectura

UI/UX Agent
|
|- UI Analyzer
|  |- layout
|  |- spacing
|  |- typography
|  |- accessibility
|  |- consistency
|
|- Design Engine
|  |- recommendation builder
|  |- improved code suggestions
|
|- Vision Analyzer
|  |- screenshot metadata analyzer
|
|- Scoring Engine
|  |- UX score 0-100
|  |- category subscores
|
`- Reporting
   |- JSON report
   |- Markdown report
   `- PR comment markdown

## Soporte de tecnologias

Entrada soportada por extension:

- HTML/CSS/SCSS
- React (JS/TS/JSX/TSX)
- Vue
- Flutter (Dart)
- SwiftUI (Swift)
- XAML

La deteccion de framework es automatica o puede forzarse con parametro.

## Uso global

Puedes usar este agente contra cualquier proyecto indicando la ruta objetivo.

```bash
yarn run uiux:agent --target "C:/ruta/de/otro-proyecto" --mode all --format both --pr-comment
```

Ejemplos:

```bash
# Analisis completo del proyecto actual
yarn run uiux:self

# Solo analisis y score
yarn run uiux:agent --target . --mode score --format json

# Analisis con screenshots
yarn run uiux:agent --target . --screenshot "./mockups/home-mobile.png" --screenshot "./mockups/home-desktop.png"
```

## Salida

Por defecto genera reportes en:

`<target>/.uiux-agent/reports/<timestamp>/`

Archivos:

- `uiux-report.json`
- `uiux-report.md`
- `uiux-pr-comment.md` (si usas `--pr-comment`)

## Prompt base del agente

```txt
You are a senior UI/UX designer.

Analyze the provided UI code or screenshot.

Focus on:
- visual hierarchy
- spacing
- typography
- accessibility
- layout balance
- modern design practices

Return:
1. Problems found
2. Design recommendations
3. Improved code
4. UX score
```

## Mejoras incluidas

- Priorizacion de problemas por severidad
- Scoring por categoria para seguimiento de calidad
- Modo global por ruta para reutilizarlo en multiples repositorios
- Salida lista para comentar en PR
