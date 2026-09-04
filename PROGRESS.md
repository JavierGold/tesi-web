# PROGRESS.md — BITÁCORA DE DESARROLLO TESI

Última actualización: 3 de septiembre de 2026.

Este documento resume el estado verificable del proyecto y debe actualizarse al finalizar cada fase importante. No sustituye a `CONTENT.md` ni a `PLAN.md`.

Regla permanente de trabajo: Después de implementar cada CAMBIO-XXX, PROGRESS.md debe actualizarse obligatoriamente antes de considerar el cambio terminado. Un cambio no se considera completado hasta que su implementación y validaciones hayan quedado registradas en PROGRESS.md.

# Estado actual

La aplicación React + Vite + TypeScript cuenta con las cuatro páginas completas a nivel visual y frontend, configuradas en `http://localhost:3000`.

El proyecto cuenta con cuatro rutas base:

- `/` — Home.
- `/sobre-nosotros` — Sobre nosotros.
- `/empleo` — Empleo.
- `/contacto` — Contacto.

Home fue aprobado por el usuario y se conservó sin rediseños. Sobre nosotros, Empleo y Contacto implementan ahora todas las secciones y textos correspondientes de `CONTENT.md` con el mismo lenguaje visual. La ruta `/sobre-nosotros` incorpora CAMBIO-001 y las correcciones puntuales de CAMBIO-002 definidas en `CHANGES.md` para los modelos visuales de gestión PMI y desarrollo continuo de talento/capacity; `/nosotros` se conserva como alias compatible.

Contacto continúa integrado con Web3Forms exactamente como quedó en CAMBIO-004. Empleo fue migrado en CAMBIO-005 a un flujo AWS con API Gateway, Lambda, S3 privado y SES; conserva React Hook Form, Zod, el uploader de CAMBIO-003 y la confirmación visual compartida. La infraestructura AWS y el frontend están desplegados, SES está verificado y el flujo completo fue validado con dos envíos reales de CV.

No existen todavía escenas 3D complejas o basadas en WebGL ni despliegue en Vercel. CAMBIO-001 utiliza únicamente profundidad 3D ligera mediante CSS en sus gráficos. El backend serverless de Empleo fue aplicado correctamente en AWS.

CAMBIO-006 está implementado y desplegado. CloudFront resuelve las rutas SPA mediante respuestas personalizadas para 403/404, el header permanece visible y se compacta durante el scroll, y la animación de “Proyecto exitoso” completa su entrada en aproximadamente 1.2 segundos.

El servidor de desarrollo fue validado correctamente en `localhost:3000` durante esta actualización.

Validación actual:

- `npm run lint`: correcto, sin errores.
- `npm run build`: correcto.
- `npm run validate:home`: correcto.
- `npm run validate:site`: correcto.
- `npm run validate:change-001`: correcto.
- `npm run validate:change-002`: correcto.
- `npm run validate:change-003`: correcto.
- `npm run validate:change-004`: correcto.
- `npm run validate:change-005`: correcto con endpoints AWS simulados.
- `npm run validate:change-006`: correcto en local y en la URL pública de CloudFront.
- `npm run test:lambda`: seis pruebas correctas, incluida la identidad byte a byte entre el objeto S3 y el adjunto MIME.
- `terraform fmt -check -recursive`: correcto.
- `terraform validate`: correcto.
- Plan de CAMBIO-005: 19 recursos a crear, 0 a modificar y 0 a destruir.
- `terraform apply "cambio005.tfplan"`: correcto; 19 recursos creados, 0 modificados y 0 destruidos.
- Plan de CAMBIO-006: 0 recursos a crear, 1 distribución CloudFront a modificar en sitio y 0 recursos a destruir.
- `terraform apply "cambio006.tfplan"`: correcto; 0 recursos agregados, 1 modificado y 0 destruidos.
- Plan post-apply: correcto, `No changes`.
- SES verificado: `VerificationStatus: SUCCESS` y `VerifiedForSendingStatus: true`.
- Dos pruebas reales completas correctas: API `200`, carga S3 `201`, Lambda/SES `200` y dos eventos de éxito en CloudWatch.
- Frontend publicado en el bucket web e invalidación CloudFront completada.
- Las cuatro rutas públicas responden con HTTP 200 en acceso directo y reload, conservan la URL solicitada y no muestran `AccessDenied`.
- Home contiene exactamente seis secciones y un único `h1`.
- Validación en Chrome headless a 320, 375, 390, 768, 1024, 1280, 1440 y 1920 px: sin overflow horizontal, imágenes rotas, errores de consola, errores de página ni recursos fallidos.
- Validación con `prefers-reduced-motion: reduce`: correcta.
- Validación integral de 32 combinaciones —cuatro rutas por ocho viewports— sin overflow horizontal, imágenes rotas, errores o warnings de consola, errores de página ni recursos fallidos.
- Navegación desktop y menú móvil verificados; el overlay bloquea scroll, cierra con Escape, conserva el foco y navega correctamente.
- Timeline verificada con cinco hitos y conversión a composición vertical en móvil.
- Formularios verificados con errores por campo, cero solicitudes cuando los datos son inválidos, un único POST por envío válido, estados de carga, prevención de doble envío, respuesta exitosa, error y reintento.
- CV verificado mediante clic, teclado y drag & drop, con rechazo de formato distinto de PDF y archivos superiores a 5 MB, manejo de nombres largos y posibilidad de quitar o cambiar el archivo.
- Build dividido por rutas mediante lazy loading, sin advertencias de tamaño de chunk.
- CAMBIO-001 verificado específicamente a 320, 390, 768 y 1440 px: ocho secciones, modelo PMI radial, flujo de talento responsive, animaciones completas, contenido íntegro, sin canvas/WebGL, sin overflow y sin errores o warnings de consola.
- CAMBIO-002 verificado específicamente a 320, 390, 768, 1024, 1280 y 1920 px: copy exacto, centro PMI siempre visible, etiqueta flotante eliminada, nodo 04 consistente y alineado, tipografía Manrope confirmada, animaciones correctas y cero overflow.
- Auditoría de npm al instalar dependencias: 0 vulnerabilidades reportadas.
- No se ha realizado ningún despliegue en Vercel.

# Completado

- Lectura completa de `CONTENT.md` y `PLAN.md` antes de iniciar el desarrollo.
- Revisión de los assets existentes en `Logo/` e `img/`.
- Conversión de `Logo/TesiLogo.png` a `Logo/TesiLogo.svg` preservando el aspecto y la transparencia mediante la imagen original incrustada.
- Creación desde cero del proyecto React + Vite + TypeScript en la raíz existente.
- Conservación de `CONTENT.md`, `PLAN.md`, `Logo/` e `img/`.
- Configuración de Vite en `localhost:3000` con puerto estricto.
- Configuración de TypeScript y ESLint.
- Instalación de las dependencias previstas por el plan:
  - React y React DOM.
  - React Router DOM.
  - GSAP.
  - Three.js.
  - React Three Fiber.
  - Drei.
  - Motion.
  - React Hook Form.
  - Zod.
  - Lucide React.
- Instalación local de Manrope mediante `@fontsource-variable/manrope`.
- Creación de la estructura inicial de carpetas:
  - `src/components/`.
  - `src/pages/`.
  - `src/sections/`.
  - `src/layouts/`.
  - `src/hooks/`.
  - `src/animations/`.
  - `src/three/`.
  - `src/forms/`.
  - `src/data/`.
  - `src/styles/`.
  - `src/utils/`.
- Configuración de React Router y layout compartido.
- Creación de páginas base para Home, Sobre nosotros, Empleo y Contacto.
- Creación del componente reutilizable `PageIntro`.
- Creación de un Header base con:
  - logo enlazado a Home;
  - navegación con `NavLink`;
  - indicador de ruta activa;
  - menú móvil básico;
  - cierre mediante la tecla Escape.
- Creación de un Footer base con:
  - logo;
  - descripción corporativa;
  - navegación;
  - correo;
  - teléfono;
  - dirección pendiente;
  - copyright.
- Creación de estilos globales con:
  - paleta TESI;
  - degradado oficial como acento;
  - variables de spacing, radios y contenedor;
  - tipografía fluida con `clamp()`;
  - estilos responsive iniciales;
  - foco visible;
  - enlace para saltar al contenido;
  - soporte inicial para `prefers-reduced-motion`.
- Construcción completa de las seis secciones de Home:
  - Hero;
  - Capacidades;
  - Tecnologías;
  - Servicios;
  - Experiencia y confianza;
  - CTA final.
- Creación de una capa de contenido específica para Home en `src/data/home.ts`.
- Separación de cada sección de Home en un componente independiente dentro de `src/sections/home/`.
- Creación de los componentes reutilizables `ActionLink` y `SectionHeading`.
- Creación de un visual tecnológico CSS en el Hero, sin 3D complejo y con un espacio identificado para integrar una escena 3D posteriormente.
- Implementación de iconografía Lucide para capacidades, servicios, grupos tecnológicos y el visual del Hero.
- Integración de los assets existentes para Unisys, HPE NonStop/Tandem, COBOL, Teradata, Ab Initio y Apache Kafka.
- Presentación prioritaria de Unisys, HPE NonStop/Tandem, COBOL, ALGOL, Teradata y Ab Initio; ALGOL se presenta tipográficamente porque no existe un logo disponible.
- Implementación de entradas escalonadas, reveals al scroll y conteo animado mediante GSAP y ScrollTrigger.
- Adaptación de las animaciones para respetar `prefers-reduced-motion`.
- Implementación responsive del Home para móvil, tablet, desktop y pantallas grandes.
- Instalación de `playwright-core` y creación de una validación reproducible del Home con el Chrome instalado en el equipo.
- Aprobación visual del Home por parte del usuario; su dirección visual se convirtió en referencia para el resto del sitio.
- Construcción completa de Sobre nosotros:
  - introducción;
  - historia en composición editorial;
  - timeline con los cinco hitos reales;
  - proceso Cómo trabajamos con cinco etapas;
  - diferenciadores;
  - principios y valores;
  - CTA final.
- Construcción completa de Empleo:
  - introducción;
  - cinco razones para trabajar en TESI;
  - siete perfiles o áreas de interés;
  - formulario de empleo y CV.
- Construcción completa de Contacto:
  - introducción;
  - formulario de contacto;
  - información de contacto.
- Creación de contenido estructurado independiente para Sobre nosotros, Empleo y Contacto.
- Creación de un Hero interior compartido y CTA interior reutilizable, manteniendo la identidad visual aprobada.
- Implementación de reveals, entradas progresivas, animación de timeline y proceso mediante GSAP/ScrollTrigger.
- Implementación de formularios accesibles con labels, estados inválidos, mensajes asociados y confirmaciones mediante regiones de estado.
- Validación frontend del CV como PDF con límite máximo de 5 MB.
- Mejora del menú móvil como overlay animado con bloqueo de scroll, cierre por Escape y ciclo de foco.
- Implementación de restauración de scroll al cambiar de ruta.
- Configuración de títulos y meta descriptions específicos para las páginas interiores.
- Separación de Sobre nosotros, Empleo y Contacto mediante lazy loading para reducir el bundle inicial.
- Creación de una validación Playwright integral y reproducible para todas las páginas, viewports e interacciones principales.
- Implementación de CAMBIO-001 en `/nosotros`, sustituyendo la sección genérica “Una forma de trabajar enfocada en resultados” por los modelos visuales de gestión PMI y desarrollo continuo de talento/capacity.
- Implementación de CAMBIO-002 en `/nosotros`, corrigiendo exclusivamente el copy y la consistencia visual y responsive de los modelos PMI y talento/capacity.
- Implementación de CAMBIO-003 en `/empleo`, sustituyendo exclusivamente la presentación nativa del selector de CV por un uploader personalizado accesible y responsive.
- Implementación de CAMBIO-004 en `/empleo` y `/contacto`, integrando ambos formularios con Web3Forms y sus estados de validación, carga, éxito y error.
- CAMBIO-005 implementado y desplegado: Empleo utiliza AWS de extremo a extremo y Contacto conserva Web3Forms.
- CAMBIO-006 implementado, desplegado y verificado: rutas SPA en CloudFront, header persistente/compacto responsive y animación PMI acelerada.

# CAMBIO-001 — Reestructuración de Sobre nosotros

Implementado el 2 de septiembre de 2026.

## Alcance realizado

- Se eliminó por completo la sección “Una forma de trabajar enfocada en resultados”, sus cinco etapas, su contenido estructurado, sus estilos y su componente `ProcessSection`.
- Se conservaron sin rediseño el Hero, la Historia, los cinco hitos de la Timeline, “Tecnología respaldada por experiencia”, Principios y valores y el CTA final.
- Historia y Timeline se separaron en dos elementos `section` semánticos, sin alterar su composición visual, para respetar la estructura de ocho secciones de CAMBIO-001.
- Se agregó “Gestión de proyectos bajo lineamientos PMI”.
- Se agregó “Desarrollo continuo de talento y capacity”.

## Componentes y archivos

- Componentes creados: `PmiModelSection` y `TalentCapacitySection`.
- Hook creado: `useAboutModelAnimations`, encapsulado exclusivamente para `/nosotros`.
- Componentes modificados: `AboutPage` para el nuevo orden y `HistorySection` para separar semánticamente Historia y Timeline.
- Componente eliminado: `ProcessSection`.
- Archivos principales modificados: `src/pages/AboutPage.tsx`, `src/data/about.ts`, `src/sections/about/HistorySection.tsx`, `src/styles/about.css`, `scripts/validate-site.mjs`, `package.json`, `CHANGES.md` y `PROGRESS.md`.
- Archivos principales creados: `src/sections/about/PmiModelSection.tsx`, `src/sections/about/TalentCapacitySection.tsx`, `src/animations/useAboutModelAnimations.ts` y `scripts/validate-change-001.mjs`.

## Construcción de los gráficos

- El gráfico PMI se construyó con un SVG inline para el anillo, guía y conexiones radiales, acompañado por capas HTML para mantener perfectamente legibles el núcleo, las cuatro dimensiones, la estructura organizacional y las capacidades de TESI.
- El modelo PMI representa Lineamientos PMI, Project Office, Portafolio de proyectos, Project Managers, Proyecto exitoso, Requerimientos, Tiempo, Costo, Calidad, Personal capacitado, Herramientas, Conocimiento y Experiencia.
- El gráfico talento/capacity se construyó como un único flujo conectado de cuatro nodos numerados. En desktop y tablet progresa horizontalmente; en móvil la misma transformación se reorganiza verticalmente de arriba hacia abajo.
- El nodo final de talento tiene mayor tamaño, contraste y profundidad para comunicar claramente el resultado “Talento preparado / Capacity”.

## Animación y profundidad

- Las secuencias utilizan GSAP y ScrollTrigger, reutilizando el sistema de animaciones existente y activándose una sola vez al entrar en viewport.
- La secuencia PMI dibuja primero el anillo, revela la estructura, presenta el núcleo, conecta progresivamente las cuatro dimensiones y finalmente muestra las capacidades.
- La secuencia de talento revela el primer nodo y después dibuja cada conexión antes de activar el nodo siguiente; el mensaje final aparece al completarse la transformación.
- Las microanimaciones posteriores son sutiles y solo se ejecutan mientras la sección permanece dentro del viewport.
- La profundidad 3D se consiguió con `perspective`, `translateZ`, `rotateX`, capas, escalas y sombras suaves mediante CSS.
- Se utilizaron CSS, SVG, GSAP/ScrollTrigger y Lucide React. No se utilizó Motion, Three.js, React Three Fiber, canvas ni WebGL.
- No se agregó ninguna dependencia.

## Responsive, accesibilidad y rendimiento

- Desktop: PMI circular/radial completo y flujo de talento horizontal con cuatro etapas conectadas.
- Tablet: ambos modelos conservan su estructura y jerarquía con dimensiones fluidas; talento mantiene la progresión horizontal.
- Mobile: PMI mantiene núcleo, dimensiones y anillo, simplifica la perspectiva y apila la estructura de soporte; talento cambia a progresión vertical sin scroll horizontal.
- `prefers-reduced-motion`: no se crean timelines GSAP, se eliminan rotaciones y ciclos continuos y todo el contenido aparece directamente en su estado final.
- Los gráficos contienen estructura semántica, encabezados, texto visible, `figure`/`figcaption`, descripciones accesibles e iconos decorativos ocultos para tecnologías de asistencia. Ningún contenido depende de hover.
- Las animaciones usan principalmente `transform`, `opacity` y trazos SVG; los ciclos se pausan fuera del viewport y no existe costo de WebGL.
- Se añadió `validate:change-001` para validar criterios específicos en Chrome headless a 320, 390, 768 y 1440 px. También se ejecutó la regresión integral `validate:site` sobre las cuatro rutas y ocho viewports.
- Resultado final: lint limpio, build correcto, cero errores o warnings de consola, cero overflow horizontal y reduced motion correcto.

## Decisiones, limitaciones y pendientes

- Se descartó WebGL porque SVG y CSS producen la profundidad solicitada con menor costo y mejor legibilidad.
- No se añadió interacción táctil adicional: toda la información permanece visible y comprensible sin hover o tap.
- No existen bloqueos técnicos conocidos en CAMBIO-001.
- Pendiente real: revisión visual del cambio por parte del usuario antes de iniciar otro cambio o fase.

# CAMBIO-002 — Ajustes de modelos PMI y Talent/Capacity

Implementado el 2 de septiembre de 2026.

## Cambios realizados

- El título PMI cambió a “Gestión de proyectos alineada a los lineamientos del PMI.”.
- La descripción se sustituyó por el copy exacto de CAMBIO-002, haciendo explícitos PMI, Project Office, Project Managers, planificación, seguimiento y control desde el encabezado.
- “Proyecto exitoso” dejó de utilizar el círculo azul marino sólido. Ahora comparte con Requerimientos, Tiempo, Costo y Calidad una superficie clara, borde fino azul, iconografía Lucide, sombra suave, forma circular y profundidad CSS.
- El centro conserva una jerarquía ligeramente superior mediante doble borde, halo discreto, peso tipográfico y profundidad moderada, sin romper el sistema visual de los demás nodos.
- Se estableció un stacking context explícito y `z-index` superior para el centro; la geometría SVG y las conexiones permanecen detrás. Su tamaño es fluido y se reduce proporcionalmente en mobile, evitando clipping, cobertura o cruces con los cuatro nodos.
- Se eliminó por completo la etiqueta flotante “LINEAMIENTOS PMI”. El anillo exterior continúa comunicando visualmente la guía del PMI, apoyado por el nuevo título y descripción, sin repetir texto dentro del gráfico.
- Project Office, Portafolio de proyectos y Project Managers permanecen visibles, alineados y sin cambios conceptuales.
- El nodo 04 de talento dejó de utilizar fondo azul marino y pasó al mismo fondo claro, dimensiones base, icono de 24 px, numeración, borde, sombra y estructura de contenido de 01, 02 y 03.
- El énfasis del nodo 04 se conserva únicamente mediante un borde ligeramente más marcado, halo cian tenue y mayor profundidad, sin alterar radicalmente tamaño, forma o color.
- “Talento preparado / Capacity” y “Generamos capacity” utilizan ahora exactamente las mismas reglas de ancho, márgenes, line-height y alineación que los otros tres bloques.

## Animaciones y tipografía

- La secuencia PMI conserva el dibujo del anillo, estructura de soporte, centro, conexiones, dimensiones y capacidades. Se retiró únicamente el paso que animaba la etiqueta flotante eliminada.
- La entrada de “Proyecto exitoso” se adaptó a la nueva superficie clara con fade, escala sutil de `0.9` y desplazamiento de profundidad moderado; la respiración mínima del doble borde permanece activa solo dentro del viewport.
- La progresión de talento, conexiones y activación de nodos se conservó. El nodo 04 entra con la misma escala base que los demás y nunca cambia a fondo oscuro durante la animación.
- La tipografía del mensaje final fue verificada mediante estilos computados en el navegador: utiliza `"Manrope Variable", Manrope, system-ui, sans-serif`, exactamente la misma familia del `body`. No se realizó ningún cambio tipográfico.
- `prefers-reduced-motion` continúa evitando timelines GSAP y microanimaciones prolongadas, mostrando directamente el estado final legible.

## Archivos y dependencias

- Archivos de implementación modificados: `src/data/about.ts`, `src/sections/about/PmiModelSection.tsx`, `src/sections/about/TalentCapacitySection.tsx`, `src/styles/about.css` y `src/animations/useAboutModelAnimations.ts`.
- Validación actualizada: `scripts/validate-change-001.mjs` amplió sus comprobaciones para cubrir los criterios vigentes de CAMBIO-002; `package.json` expone el comando `validate:change-002` sobre esa suite de regresión de los modelos.
- Documentación modificada: `CHANGES.md` y `PROGRESS.md`.
- No se agregó ninguna dependencia.

## Validaciones

- `npm run validate:change-002`: seis viewports sin fallos —mobile 320 y 390 px, tablet 768 px, resolución intermedia 1024 px, laptop 1280 px y desktop amplio 1920 px—.
- La prueba verificó durante la animación y en estado final que “Proyecto exitoso” permanece contenido, visible, por encima de capas decorativas y sin superposición con los cuatro nodos.
- La prueba confirmó dimensiones CSS base iguales en los cuatro nodos de talento, superficie clara en 04 y métricas de copy idénticas para título y descripción.
- No se detectó scroll horizontal, contenido cortado, recursos fallidos, errores de página ni errores o warnings de consola.
- `npm run validate:site`: 32 combinaciones de las cuatro rutas por ocho viewports, sin regresiones.
- `npm run validate:home`: ocho viewports, sin regresiones.
- `npm run lint`: correcto, sin errores ni warnings.
- `npm run build`: correcto.
- No existen limitaciones técnicas o bloqueos conocidos en CAMBIO-002.
- Pendiente real: revisión visual de CAMBIO-002 por parte del usuario.

# CAMBIO-003 — Uploader de CV en Empleo

Implementado el 2 de septiembre de 2026.

## Implementación realizada

- El `<input type="file">` nativo continúa presente, asociado a su `label`, con `accept=".pdf,application/pdf"` y conectado a React Hook Form, pero se oculta únicamente de forma visual mediante una técnica de recorte accesible. Ya no aparecen “Elegir archivo” ni “No se eligió ningún archivo”.
- Toda el área delimitada por el borde punteado es ahora un botón real que abre el selector mediante la referencia del input. En dispositivos táctiles la misma área funciona mediante toque; con teclado responde a la activación nativa de botón y conserva un foco visible.
- El drag & drop se implementó con los eventos HTML5 `dragenter`, `dragover`, `dragleave` y `drop`. En desktop muestra un cambio sutil de borde, fondo y posición mientras el archivo puede soltarse.
- El estado inicial muestra icono Lucide de carga, “Adjuntar CV”, “Selecciona o arrastra tu archivo PDF” y la indicación permanente “PDF, máximo 5 MB.”.
- Un PDF válido cambia a un estado de confirmación con icono Lucide, nombre real del archivo, “Archivo listo para enviar” y la acción visible “Cambiar archivo”. La acción “Quitar archivo” limpia tanto el input como el estado controlado del formulario.
- Los nombres largos utilizan ancho flexible y corte seguro con `overflow-wrap`, además de conservar el nombre completo en el atributo `title`; no rompen ni desbordan el formulario.
- La selección por clic y el drop se normalizan en un `FileList` independiente y se integran mediante `useController`. Esto evita que el navegador o el input nativo pierdan el valor controlado al reemplazar archivos rápidamente.

## Validación y manejo de errores

- Se conservó el esquema Zod existente como fuente de verdad: un único archivo con MIME `application/pdf` y tamaño máximo de 5 MB.
- El mismo esquema se evalúa al seleccionar o soltar el archivo para presentar inmediatamente “El CV debe ser un archivo PDF.” o “El CV no debe superar 5 MB.”. Un archivo inválido nunca adopta el estado “Archivo listo para enviar”.
- Los errores se anuncian con `role="alert"`; el control y el input incluyen `aria-invalid` y referencias al texto de ayuda y al error mediante `aria-describedby`.
- La información no depende únicamente del color: cada estado utiliza icono, texto explícito y acciones nombradas.
- `prefers-reduced-motion` elimina las transiciones perceptibles del uploader mediante las reglas de motion ya existentes; todo el contenido permanece visible y funcional.

## Responsive, archivos y pruebas

- Desktop y laptop: composición horizontal del icono y contenido, drag & drop activo y área completa clicable.
- Tablet: conserva la composición horizontal sin recortes ni deformaciones.
- Mobile: el contenido del uploader se apila verticalmente, conserva una zona táctil amplia y los nombres largos se adaptan sin scroll horizontal.
- Archivos de implementación modificados: `src/forms/CareersForm.tsx` y `src/styles/employment.css`.
- Pruebas modificadas o creadas: `scripts/validate-site.mjs`, `scripts/validate-change-003.mjs` y el script `validate:change-003` en `package.json`.
- Documentación modificada: `CHANGES.md` y `PROGRESS.md`.
- `npm run validate:change-003`: correcto en mobile 390 px, tablet 768 px, laptop 1280 px y desktop amplio 1920 px. Al cerrar CAMBIO-003 —antes de la integración posterior de CAMBIO-004— verificó estado inicial, input nativo oculto, clic, teclado, feedback de drag, drop, PDF válido, archivo no PDF, PDF superior a 5 MB, nombre largo, quitar/cambiar, envío entonces local, cero POST, consola, overflow y reduced motion.
- `npm run validate:site`: correcto en 32 combinaciones de cuatro rutas por ocho viewports, sin regresiones, overflow horizontal, errores o warnings de consola, recursos fallidos ni errores de página.
- `npm run lint`: correcto, sin errores ni warnings.
- `npm run build`: correcto.
- No se agregó ninguna dependencia.
- CAMBIO-003 no añadió por sí mismo integración de envío; esa capacidad fue incorporada posteriormente por CAMBIO-004. Drag & drop es complementario en desktop; clic, toque y teclado permanecen disponibles en todos los tamaños compatibles.
- No existen bloqueos técnicos conocidos en CAMBIO-003. Pendiente real: revisión visual del uploader por parte del usuario.

# Decisiones tomadas

- `CONTENT.md` permanece como fuente de verdad de todos los textos.
- `PLAN.md` permanece como especificación principal de diseño, arquitectura y comportamiento.
- `PROGRESS.md` será la bitácora permanente de avances relevantes entre sesiones.
- El orden obligatorio de lectura al comenzar una sesión es `CONTENT.md`, `PLAN.md` y `PROGRESS.md`.
- Se utiliza React con Vite y TypeScript; no se utiliza Create React App.
- La aplicación usa React Router para evitar recargas completas entre rutas internas.
- Manrope se sirve desde el propio bundle con Fontsource, evitando depender de una solicitud externa a Google Fonts.
- Los textos globales de navegación y empresa se centralizan inicialmente en `src/data/site.ts`.
- El layout compartido contiene Header, área principal mediante `Outlet` y Footer.
- Lucide React es la única librería de iconografía de interfaz instalada.
- Las dependencias de animación, 3D y formularios quedaron instaladas, pero se incorporarán al código solo en las fases correspondientes.
- GSAP y ScrollTrigger se utilizan exclusivamente para las entradas, reveals y cifras animadas del Home; el contenido permanece visible si las animaciones no se ejecutan.
- El contenido del Home está separado de sus componentes visuales en `src/data/home.ts`, preparando la arquitectura para internacionalización futura.
- La versión final de cuatro capacidades confirmada por `PLAN.md` prevalece sobre el primer bloque duplicado e incompleto de Capacidades presente en `CONTENT.md`.
- Los logos tecnológicos existentes se muestran sin recolorearlos ni deformarlos. Cuando falta un logo, se utiliza únicamente el nombre tipográfico.
- El Hero utiliza por ahora una composición CSS relacionada con sistemas, datos y seguridad; no se cargan Three.js ni React Three Fiber en esta etapa.
- Las páginas interiores reutilizan tokens, ritmo, tipografía, superficies, CTAs y visuales abstractos compatibles con el Home aprobado.
- El contenido de cada página reside en su propio archivo dentro de `src/data/`, separado de presentación y preparado para internacionalización futura.
- El límite frontend del CV se fijó en 5 MB y solo se acepta MIME `application/pdf`.
- Contacto utiliza `fetch` y `FormData` contra Web3Forms mediante `src/services/web3forms.ts`.
- Empleo utiliza `src/services/employment.ts`: solicita una autorización de carga, sube el PDF directamente a S3 y confirma la candidatura mediante la API AWS. No existe base de datos ni servidor permanente.
- La Access Key se obtiene de `VITE_WEB3FORMS_ACCESS_KEY`; `.env.local` contiene la configuración local y está ignorado, mientras `.env.example` documenta únicamente el nombre de la variable.
- Sobre nosotros, Empleo y Contacto se cargan bajo demanda con `React.lazy` y `Suspense`; Home permanece en el bundle inicial.
- Las animaciones compartidas comprueban la existencia de timeline o proceso antes de crear ScrollTriggers, evitando warnings en páginas que no contienen esos elementos.
- Los Heroes interiores conservan un slot estructural para 3D, pero utilizan por ahora elementos CSS ligeros e iconografía Lucide.
- CAMBIO-001 utiliza SVG y profundidad CSS en lugar de WebGL para mantener legibilidad, rendimiento y coherencia con el diseño aprobado.
- El Header es persistente y se compacta de forma responsive durante el scroll; el Footer conserva su implementación existente.
- No se preparó ni ejecutó un despliegue en Vercel durante esta etapa.

# Archivos importantes modificados

- `PLAN.md`: especificación general y reglas de continuidad de la bitácora.
- `PROGRESS.md`: estado permanente del desarrollo.
- `package.json`: scripts y dependencias del proyecto.
- `package-lock.json`: versiones resueltas de dependencias.
- `vite.config.ts`: servidor y preview configurados en `localhost:3000`.
- `tsconfig.json`, `tsconfig.app.json` y `tsconfig.node.json`: configuración TypeScript.
- `eslint.config.js`: reglas de lint para React y TypeScript.
- `index.html`: documento raíz y metadatos básicos.
- `src/main.tsx`: montaje de React, BrowserRouter, Manrope y estilos globales.
- `src/App.tsx`: definición de las cuatro rutas.
- `src/layouts/SiteLayout.tsx`: layout compartido.
- `src/components/layout/Header.tsx`: navegación principal y menú móvil base.
- `src/components/layout/Footer.tsx`: pie de página base.
- `src/components/ui/PageIntro.tsx`: introducción reutilizable de página.
- `src/data/site.ts`: navegación e información corporativa global.
- `src/pages/HomePage.tsx`: introducción base de Home.
- `src/pages/AboutPage.tsx`: composición y orden de las ocho secciones de Sobre nosotros.
- `src/pages/EmploymentPage.tsx`: introducción base de Empleo.
- `src/pages/ContactPage.tsx`: introducción base de Contacto.
- `src/styles/global.css`: tokens visuales, reset y estilos base responsive.
- `src/styles/home.css`: composición, estados interactivos y responsive de las seis secciones de Home.
- `src/data/home.ts`: contenido estructurado de las seis secciones de Home.
- `src/animations/useHomeAnimations.ts`: secuencias GSAP, ScrollTrigger y conteos.
- `src/components/ui/ActionLink.tsx`: CTA reutilizable con variantes.
- `src/components/ui/SectionHeading.tsx`: encabezado reutilizable de sección.
- `src/components/ui/InteriorHero.tsx`: Hero compartido de páginas interiores y slot futuro para 3D.
- `src/components/ui/InteriorCta.tsx`: CTA final compartido de páginas interiores.
- `src/components/layout/ScrollToTop.tsx`: restauración de scroll al navegar.
- `src/data/about.ts`: contenido estructurado de Sobre nosotros.
- `src/data/employment.ts`: contenido estructurado de Empleo.
- `src/data/contact.ts`: contenido estructurado de Contacto.
- `src/animations/usePageAnimations.ts`: animaciones y ScrollTriggers de páginas interiores.
- `src/hooks/usePageMetadata.ts`: título y descripción por ruta.
- `src/forms/CareersForm.tsx`: formulario frontend de empleo y CV.
- `src/forms/ContactForm.tsx`: formulario frontend de contacto.
- `src/sections/about/`: historia, timeline, diferenciadores, modelos PMI y talento/capacity, y valores.
- `src/sections/employment/`: razones, perfiles y formulario de empleo.
- `src/sections/contact/`: formulario e información de contacto.
- `src/styles/interior.css`: sistema visual compartido de páginas interiores y formularios.
- `src/styles/about.css`: timeline, diferenciadores, modelos PMI y talento/capacity, valores y responsive específico.
- `src/sections/about/PmiModelSection.tsx`: composición radial del modelo de gestión PMI.
- `src/sections/about/TalentCapacitySection.tsx`: flujo conectado de desarrollo continuo de talento/capacity.
- `src/animations/useAboutModelAnimations.ts`: secuencias GSAP y control de microanimaciones en viewport.
- `scripts/validate-change-001.mjs`: validación específica de estructura, gráficos, responsive, consola y reduced motion.
- `scripts/validate-change-003.mjs`: validación específica del uploader de CV, sus estados, interacciones, errores, responsive y accesibilidad.
- `scripts/validate-change-004.mjs`: validación específica de payloads Web3Forms, CV adjunto, validaciones, carga, doble envío, éxito, error, conservación de datos y responsive.
- `src/services/web3forms.ts`: cliente común del endpoint de Web3Forms y comprobación de su respuesta.
- `src/styles/employment.css`: razones y perfiles de Empleo.
- `src/styles/contact.css`: formulario e información de Contacto.
- `scripts/validate-site.mjs`: validación integral responsive, funcional y de consola.
- `src/sections/home/HeroSection.tsx`: Hero y espacio visual futuro para 3D.
- `src/sections/home/CapabilitiesSection.tsx`: capacidades.
- `src/sections/home/TechnologiesSection.tsx`: tecnologías principales y complementarias.
- `src/sections/home/ServicesSection.tsx`: servicios.
- `src/sections/home/ExperienceSection.tsx`: experiencia, confianza y cifras animadas.
- `src/sections/home/FinalCtaSection.tsx`: CTA final.
- `scripts/validate-home.mjs`: validación responsive, de consola, assets, estructura y reduced motion.
- `Logo/TesiLogo.svg`: versión SVG utilizada por la aplicación.
- `Logo/convert_tesilogo_to_svg.ps1`: utilidad que genera el SVG a partir del PNG.

# Pendientes

- Revisión visual de CAMBIO-003 en `/empleo` por parte del usuario y aplicación únicamente de ajustes solicitados posteriormente.
- Fase 5: diseñar e integrar escenas 3D optimizadas únicamente cuando exista autorización.
- CAMBIO-005 está implementado, desplegado y verificado de extremo a extremo. La recepción/renderizado visual de los correos en la bandeja de Gmail solo puede confirmarse manualmente por el propietario de la cuenta.
- Completar SEO técnico pendiente: canonical, Open Graph, Twitter cards, sitemap, robots.txt, favicon definitivo y datos estructurados.
- Ejecutar auditorías finales de accesibilidad y rendimiento, incluyendo Lighthouse y una herramienta automatizada de WCAG cuando corresponda.
- Preparar headers de seguridad y configuración de producción durante la fase previa al despliegue.
- Fase 10: preparar el despliegue en Vercel únicamente cuando sea autorizado.
- Confirmar la dirección corporativa y la URL de LinkedIn indicadas como pendientes en `CONTENT.md`.
- Evaluar la vectorización nativa u optimización del logo principal.

# Problemas conocidos

## Resueltos durante esta fase

- La primera compilación detectó un type guard incompatible en el ciclo de foco del menú; se corrigió usando la unión exacta de elementos permitidos.
- El build inicial superó el umbral de 500 KB; se resolvió con lazy loading por ruta y división automática de chunks.
- GSAP generaba warnings al buscar timeline y proceso en páginas que no los incluían; se resolvió creando animaciones únicamente cuando ambos nodos existen.
- El primer validador integral contenía sintaxis TypeScript en un archivo JavaScript y selectores ambiguos; se corrigieron antes de realizar la validación definitiva.
- La cuadrícula desktop de perfiles dejaba una celda vacía visualmente destacada; se redistribuyó la última fila en tres columnas iguales.
- La primera integración del uploader con `register` perdía el `FileList` al reemplazar un archivo nativo antes del envío; se resolvió controlando exclusivamente ese campo con `useController` y normalizando selecciones y drops en un `FileList` independiente.

## Pendientes reales

- La prueba automatizada de CAMBIO-004 intercepta Web3Forms y valida el contenido de las solicitudes sin enviar correos reales. La entrega real depende de una Access Key válida, conectividad y disponibilidad/condiciones del servicio Web3Forms.
- Amazon SES permanece en sandbox en `us-east-1`, pero la identidad única usada como remitente y destinatario está verificada. Si en el futuro se cambia el destinatario a una identidad no verificada, será necesario verificarla o solicitar acceso de producción.
- Las dos pruebas reales fueron aceptadas por SES y registradas como éxito por Lambda. Este entorno no tiene acceso a la bandeja Gmail para inspeccionar visualmente la entrega o el renderizado final.
- Las escenas 3D complejas todavía no están implementadas; los Heroes conservan espacios estructurales para agregarlas posteriormente. CAMBIO-001 incorpora únicamente sensación de profundidad mediante CSS y SVG.
- `Logo/TesiLogo.svg` es un contenedor SVG con el PNG original incrustado, no un trazado vectorial nativo. Conserva fielmente la apariencia, pero pesa aproximadamente 555 KB.
- La dirección y LinkedIn continúan sin confirmar porque `CONTENT.md` los marca como pendientes.

# Próximo paso

CAMBIO-006 no tiene trabajo técnico pendiente dentro de su alcance.

# CAMBIO-004 — Integración y validación de formularios con Web3Forms

## Objetivo y estado

- Objetivo: hacer funcionales los formularios actuales de Empleo y Contacto mediante Web3Forms, sin backend propio, con validaciones específicas, CV adjunto en Empleo y manejo completo de carga, éxito y error.
- Estado verificable: implementado el 3 de septiembre de 2026. El código y las pruebas específicas correspondientes están presentes. No existe historial Git disponible en la carpeta para complementar la reconstrucción.

## Implementación realizada

- Los formularios existentes de Empleo y Contacto envían sus campos propios a `https://api.web3forms.com/submit` mediante `FormData` y esperan la confirmación real `success: true` de Web3Forms.
- Empleo envía nombre, correo, teléfono, área, tecnologías, disponibilidad, mensaje y el PDF seleccionado como `attachment`. Contacto envía nombre, empresa, correo, teléfono, servicio o necesidad y mensaje.
- Los asuntos y remitentes identifican el origen como `TESI - Empleo` y `TESI - Contacto`.
- La Access Key se lee desde `VITE_WEB3FORMS_ACCESS_KEY`. La clave local está en `.env.local`, excluido del control de versiones; `.env.example` documenta la variable sin contener secretos y `.gitignore` protege los archivos `.env` locales.
- Cada esquema Zod conserva validaciones específicas para sus campos. Se reforzaron nombre y teléfono; el CV mantiene un único PDF de máximo 5 MB.
- Durante el envío, el botón queda deshabilitado y muestra `Enviando CV…` o `Enviando mensaje…`, evitando solicitudes duplicadas.
- Solo después de una respuesta exitosa se oculta el formulario y se muestra `Gracias por tu mensaje, nos pondremos en contacto` en una confirmación responsive coherente con el lenguaje visual de TESI.
- Ante un error de red o de Web3Forms, el formulario permanece visible, conserva todos los datos, muestra el error y permite reintentar.

## Archivos principales creados o modificados

- Configuración: `.gitignore`, `.env.example` y `.env.local` (solo local, ignorado).
- Implementación: `src/forms/CareersForm.tsx`, `src/forms/ContactForm.tsx`, `src/services/web3forms.ts` y `src/styles/interior.css`.
- Pruebas: `scripts/validate-change-004.mjs`, `scripts/validate-site.mjs` y `package.json`.
- Bitácora: `PROGRESS.md`.

## Validaciones realizadas

- `npm run validate:change-004`: correcto. Verificó ambos formularios con respuestas Web3Forms simuladas: campos obligatorios, cero solicitudes inválidas, payloads independientes, archivo PDF adjunto, carga, bloqueo de doble envío, confirmación, ocultamiento del formulario, responsive móvil, error, conservación de datos y reintento.
- `npm run validate:site`: correcto en 32 combinaciones de cuatro rutas por ocho viewports; sin regresiones, overflow horizontal, recursos fallidos, errores de página ni errores o warnings de consola.
- `npm run lint`: correcto, sin errores ni warnings.
- `npm run build`: correcto.
- Se comprobó que la Access Key no aparece en archivos versionables. La carpeta recibida no contiene metadatos `.git`, por lo que la exclusión se verificó contra las reglas de `.gitignore` y mediante búsqueda directa fuera de `.env.local` y `dist/`.
- No se implementó ningún otro cambio de `CHANGES.md` ni se modificó infraestructura.

## Decisiones técnicas y pendientes conocidos

- Se reutilizaron React Hook Form, Zod y `fetch`; CAMBIO-004 no agregó dependencias, backend ni base de datos.
- El servicio común solo considera exitoso el envío cuando la respuesta HTTP es correcta y Web3Forms devuelve `success: true`.
- Se utiliza `FormData` en ambos formularios para mantener una ruta de envío común y permitir que Empleo incluya el archivo bajo el campo `attachment`.
- La confirmación automatizada usa respuestas Web3Forms simuladas y no prueba la recepción final de un correo real.
- El adjunto de Empleo estaba sujeto a la capacidad de archivos del plan de Web3Forms. CAMBIO-005 reemplazó y desplegó esa integración mediante AWS.

## Revisión de trazabilidad de CAMBIO-001 a CAMBIO-003

- CAMBIO-001 está reflejado con objetivo material, secciones eliminadas/agregadas, técnicas SVG/CSS y GSAP, accesibilidad, responsive, archivos y validaciones comprobables.
- CAMBIO-002 está reflejado con los cambios de copy, el nuevo tratamiento de “Proyecto exitoso”, la corrección del nodo 04, animaciones conservadas, archivos y validaciones responsive.
- CAMBIO-003 está reflejado con ocultamiento accesible del input nativo, clic/teclado/drag & drop, estados, validación PDF/5 MB, responsive, accesibilidad, archivos y pruebas. Sus referencias al envío local quedaron aclaradas como el estado histórico anterior a CAMBIO-004.

# CAMBIO-005 — Formulario de Empleo con envío de CV mediante AWS

## Objetivo y estado actual

- Objetivo: migrar exclusivamente el formulario de Empleo desde Web3Forms a una arquitectura serverless AWS que valide, almacene de forma privada y envíe el CV por correo; Contacto debe permanecer sin cambios en Web3Forms.
- Estado: **implementado, desplegado y verificado** el 3 de septiembre de 2026. Se crearon 19 recursos, sin modificar ni destruir recursos existentes. La identidad SES está verificada, el frontend está publicado y dos candidaturas controladas completaron el flujo real.
- AWS CLI confirmó la cuenta `446703866994`, región `us-east-1` y acceso mediante el perfil `tesi`.
- SES tiene envío habilitado, estado saludable y `ProductionAccessEnabled: false`; la cuenta está en sandbox, con cuota de 200 mensajes por 24 horas y 1 mensaje por segundo. No había identidades SES antes del plan.

## Funcionalidades implementadas

- Empleo dejó de importar o utilizar `submitToWeb3Forms`; Contacto conserva ese servicio, sus campos, validaciones, diseño, envío y confirmación.
- Disponibilidad se convirtió en selector obligatorio con únicamente `Tiempo completo` y `Medio tiempo`; el esquema frontend rechaza cualquier otro valor.
- El frontend solicita una autorización de carga, sube el PDF directamente a S3 mediante POST prefirmado y envía después todos los campos reales junto con una clave y token opacos.
- Se conservan el diseño, uploader PDF, límite de 5 MB, carga, botón deshabilitado, prevención de doble envío, conservación de datos ante error y mensaje exacto de confirmación usado por Contacto.
- Lambda revalida nombre, email, teléfono, área, tecnologías, disponibilidad, mensaje, clave S3, token, MIME, tamaño y contenido PDF. No confía únicamente en extensión o MIME del navegador.
- La autorización S3 limita clave exacta, MIME, cifrado, vigencia y tamaño; el visitante no elige la ruta del objeto ni recibe credenciales AWS.
- El bucket es privado, bloquea acceso público, exige TLS, usa cifrado SSE-S3 y elimina CV y bloqueos después de 30 días. Las cargas multipart incompletas se cancelan tras un día.
- Lambda utiliza un objeto de bloqueo por candidatura para evitar reprocesamientos, genera un enlace S3 temporal y envía mediante SES un correo HTML/texto identificado como `TESI - Empleo`, con todos los campos, Reply-To del candidato y PDF adjunto.
- Los errores internos se registran sin CV, secretos ni datos completos y se traducen a mensajes públicos seguros.

## Infraestructura Terraform

- API Gateway HTTP API con dos rutas: `POST /employment/upload` y `POST /employment/submit`, integración proxy Lambda, stage automático, throttling de 2 solicitudes/segundo y burst de 5.
- Una Lambda Node.js 22 ARM64 de 256 MB y timeout de 30 segundos; Terraform empaqueta automáticamente `index.mjs` y `core.mjs` mediante el provider Archive y actualiza por hash.
- Bucket S3 independiente para CV, Public Access Block, ownership enforced, cifrado, CORS, política TLS y lifecycle de 30 días.
- Identidad Amazon SES `567498jav@gmail.com`; destinatario y remitente se configuran en variables/entorno Lambda, nunca desde el navegador.
- Rol y policy IAM propios con acceso limitado a objetos del bucket, la identidad SES y el log group de la Lambda.
- Log groups de Lambda y API Gateway con retención de 14 días.
- CORS exacto para `http://localhost:3000`, `http://127.0.0.1:3000` y `https://dvvnw97d7nz0s.cloudfront.net`, ampliable mediante variable Terraform.
- Outputs para URL base de la API, bucket privado e identidad SES.

## Resultado de terraform plan

- Plan guardado localmente como `infra/cambio005.tfplan` y excluido del control de versiones.
- Resultado: **19 a crear, 0 a modificar, 0 a destruir**.
- Terraform muestra `no-op` para el bucket web existente, CloudFront, OAC y la policy del hosting; no existe impacto planificado sobre la infraestructura actual.
- Recursos a crear: API, integración, dos rutas y stage de API Gateway; Lambda y permiso de invocación; rol y policy IAM; dos log groups; bucket de CV y sus cinco configuraciones de seguridad/lifecycle; identidad SES.

## Resultado de terraform apply y outputs

- Se ejecutó el plan guardado autorizado: **19 agregados, 0 modificados, 0 destruidos**.
- API de Empleo: `https://sq7fb89w18.execute-api.us-east-1.amazonaws.com`.
- Bucket privado de CV: `tesi-employment-cv-446703866994`.
- Identidad SES: `567498jav@gmail.com`.
- El plan post-apply devolvió `No changes`; el estado real coincide con Terraform.
- `.env.local` quedó configurado con el endpoint mediante `VITE_EMPLOYMENT_API_URL`; permanece ignorado y no contiene credenciales AWS.

## Verificación SES y despliegue del frontend

- Después de confirmar el enlace enviado por AWS, SES reportó `VerificationStatus: SUCCESS` y `VerifiedForSendingStatus: true` para `567498jav@gmail.com`.
- Se mantuvo la cuenta en sandbox porque remitente y destinatario son la misma identidad verificada; el flujo actual puede operar con esta configuración.
- El frontend se compiló con el endpoint real y se sincronizó desde `dist/` hacia `s3://tesi-web-446703866994`, eliminando únicamente assets hash obsoletos del despliegue anterior.
- Se creó la invalidación `IARXL3M1ULNF5E7IKH457EE0AM` sobre la distribución CloudFront `E1H2B9ZAMMEKWL`, con alcance `/*`; AWS confirmó el estado `Completed`.
- La aplicación publicada responde en `https://dvvnw97d7nz0s.cloudfront.net`. El bundle lazy de Empleo contiene el endpoint AWS y no contiene Web3Forms; el bundle de Contacto contiene Web3Forms y no contiene el endpoint de Empleo.

## Archivos principales creados

- `src/services/employment.ts`.
- `infra/employment.tf`, `infra/variables.tf`, `infra/outputs.tf` e `infra/README.md`.
- `infra/lambda/employment/index.mjs`, `infra/lambda/employment/core.mjs` e `infra/lambda/employment/core.test.mjs`.
- `scripts/validate-change-005.mjs`.
- `scripts/verify-employment-live.mjs`.

## Archivos principales modificados

- `src/forms/CareersForm.tsx`, `src/vite-env.d.ts`, `.env.example`, `.gitignore`, `package.json`, `scripts/validate-site.mjs`, `infra/main.tf`, `infra/.terraform.lock.hcl` y `PROGRESS.md`.
- `src/forms/ContactForm.tsx`, los estilos de Contacto y la integración `src/services/web3forms.ts` no fueron modificados.

## Validaciones ejecutadas

- `npm run build`: correcto; incluye TypeScript mediante `tsc -b` y build Vite.
- `npm run lint`: correcto, sin errores ni warnings.
- `npm run test:lambda`: seis pruebas correctas para metadatos de carga, ambas disponibilidades, rechazo de disponibilidad arbitraria, campos/referencias seguras, estructura PDF, sanitización, correo MIME y conservación byte a byte del adjunto.
- `npm run validate:change-005`: correcto con AWS simulado; verificó campos vacíos, disponibilidad vacía/inválida, ambas opciones válidas, PDF, carga directa, payload, loading, doble envío, errores en autorización/S3/submit, conservación de datos, reintento, responsive, Contacto en Web3Forms y confirmación visual idéntica.
- `npm run validate:site`: 32 combinaciones de cuatro rutas por ocho viewports, sin regresiones, overflow, recursos fallidos, errores de página ni errores/warnings de consola; navegación y Contacto correctos.
- `terraform fmt -recursive` y `terraform fmt -check -recursive`: correctos.
- `terraform validate`: correcto.
- `terraform plan`: correcto; 19 altas, 0 cambios y 0 bajas.
- `terraform apply "cambio005.tfplan"`: correcto; 19 altas, 0 cambios y 0 bajas.
- `terraform plan` posterior: correcto, sin diferencias.
- Se revisó el ZIP generado: contiene únicamente `core.mjs` e `index.mjs`.
- Verificación real de API Gateway/Lambda: carga inválida `400`, autorización válida `200`, disponibilidad no permitida `400`, origen CORS no permitido `403` y preflight permitido `204` con el origen local correcto.
- Verificación real de S3: Public Access Block completo, cifrado AES256 y lifecycle activo de 30 días con cancelación de multipart incompleto tras un día.
- Verificación real de SES: `VerificationStatus: SUCCESS` y `VerifiedForSendingStatus: true`.
- `npm run verify:employment-live`: correcto. Generó un PDF válido de 618 bytes en memoria, obtuvo autorización `200`, lo subió al S3 privado con `201` y recibió confirmación backend/SES `200`.
- Prueba real desde el frontend publicado en móvil 390 px: navegación a `/empleo`, selección `Medio tiempo`, subida S3 `201`, ambas llamadas API `200`, confirmación visible, formulario oculto, sin overflow ni errores de consola.
- CloudWatch contiene dos eventos `employment_application_sent`; S3 contiene dos CV de prueba y sus dos bloqueos, todos sujetos al lifecycle de 30 días.
- Lambda reporta estado `Active`, actualización `Successful`, runtime Node.js 22 y arquitectura ARM64. El stage de API Gateway reporta despliegue correcto.
- CloudFront confirmó la invalidación y los bundles publicados separan correctamente AWS para Empleo y Web3Forms para Contacto. Los hashes MD5/ETag de `index.html` y `EmploymentPage-D6ljDegr.js` publicados coinciden exactamente con los artefactos locales de la compilación validada.

## Decisiones técnicas y estado final

- Se eligió POST prefirmado de S3 para que el PDF no atraviese API Gateway/Lambda durante la carga y para imponer condiciones de tamaño y tipo desde S3; Lambda descarga el objeto únicamente al procesar el correo.
- Se reutiliza el AWS SDK v3 incluido en el runtime Node.js de Lambda y se empaqueta únicamente el código propio; no se añadieron dependencias de aplicación.
- El enlace S3 se firma por 12 horas y puede expirar antes si las credenciales temporales del rol rotan; el PDF adjunto es el mecanismo principal de entrega al destinatario.
- API Gateway, Lambda, S3, SES, IAM, CORS, CloudWatch y el frontend publicado quedaron verificados dentro de lo automatizable.
- SES aceptó dos correos reales y Lambda devolvió éxito únicamente después de `SendRawEmail`. La inspección de la bandeja Gmail y del renderizado visual no puede automatizarse con las herramientas disponibles.
- SES continúa en sandbox. No afecta al destinatario actual verificado, pero limita futuros destinatarios no verificados.
- No quedan tareas de programación, infraestructura o despliegue pendientes para CAMBIO-005.

## Corrección de integridad del adjunto PDF — 3 de septiembre de 2026

### Incidencia y causa comprobada

- Se reportó que uno de los CV recibidos por Gmail no podía previsualizarse ni abrirse después de descargarlo.
- Se auditó el recorrido completo S3 → Lambda → construcción MIME → SES. La Lambda desplegada coincidía con el código y hash de Terraform; `GetObjectCommand` conservaba el tamaño del objeto y la codificación base64 del MIME, al extraerse y decodificarse localmente, producía exactamente los mismos bytes y SHA-256 que S3.
- El CV real de diagnóstico almacenado en S3 tenía 227774 bytes, ETag/MD5 `f7ef56f7fae67c3527dc54d6f29c65b7`, SHA-256 `f5ee1af269d13f598256b429d7ca96c88e52e0aa2646a3cb9f7c0c1c2e685cac`, encabezado y cierre PDF correctos, y Chrome lo abrió sin errores.
- La causa reproducible fue un archivo de prueba previo de solo 48 bytes. Contenía `%PDF-1.4`, un objeto vacío, `trailer` y `%%EOF`, pero carecía de catálogo, tabla de referencias y `startxref`; no era un PDF estructuralmente válido. La validación anterior solo buscaba el encabezado y `%%EOF`, por lo que aceptó ese falso positivo y lo envió correctamente como adjunto. Gmail recibió bytes inválidos de origen; no hubo conversión de bytes en S3, Lambda, MIME o SES.
- La prueba unitaria anterior únicamente comprobaba encabezados MIME y la presencia declarativa del adjunto; no extraía su contenido base64 ni verificaba sus bytes. Esta omisión permitió que el falso PDF de prueba no se detectara.

### Corrección implementada

- `infra/lambda/employment/core.mjs`: `isPdf` exige ahora un tamaño mínimo y la presencia de `%PDF-`, `startxref` y `%%EOF`, evitando aceptar el archivo incompleto que reprodujo la incidencia.
- `infra/lambda/employment/core.mjs`: se añadió `extractPdfAttachment`, que localiza la parte PDF del mensaje MIME, valida estrictamente su base64 y devuelve los bytes decodificados.
- `infra/lambda/employment/index.mjs`: antes de ejecutar `SendRawEmail`, Lambda extrae el adjunto del mensaje MIME construido y exige que sea idéntico mediante `Buffer.equals` al objeto leído desde S3. Si difiere un solo byte, el correo no se envía y se usa el manejo seguro de errores existente.
- `infra/lambda/employment/index.mjs`: el evento de éxito registra únicamente tamaño y SHA-256 del CV, sin almacenar su contenido ni datos personales completos, para permitir verificar la integridad de futuras ejecuciones.
- `infra/lambda/employment/core.test.mjs`: se agregó una prueba que trata un `Buffer` binario como los bytes recibidos desde S3, construye el correo, extrae el adjunto como lo haría un receptor MIME y comprueba longitud e igualdad byte a byte, incluyendo valores `0x00`, `0x80` y `0xFF`.
- `scripts/verify-employment-live.mjs`: permite usar un PDF real mediante `EMPLOYMENT_TEST_PDF` y reporta tamaño y SHA-256 del archivo enviado.
- No se modificaron el frontend, Contacto, API Gateway, S3, SES, IAM, CloudFront ni ninguna funcionalidad ajena a la integridad del PDF de Empleo.

### Validación y despliegue de la corrección

- `npm run test:lambda`: seis de seis pruebas correctas. La nueva prueba confirma que los bytes extraídos del adjunto MIME son idénticos a los bytes de entrada procedentes de S3.
- `npm run lint`, `npm run build`, `terraform fmt -check -recursive` y `terraform validate`: correctos.
- Plan guardado como `infra/cambio005-fix-pdf.tfplan`: `0` recursos a crear, `1` a modificar in-place y `0` a destruir; el único recurso afectado fue `aws_lambda_function.employment`.
- Aplicación del plan: correcta, `0` recursos agregados, `1` modificado y `0` destruidos.
- Lambda posterior al despliegue: `State: Active`, `LastUpdateStatus: Successful`, hash de código `ijAc58xvgsjXUq2qQrvFBSFjPU9wQlYaeDkInzPzCO8=`.
- Prueba real con el PDF válido de 227774 bytes: autorización API `200`, carga S3 `201`, procesamiento Lambda/SES `200` y respuesta `Solicitud enviada correctamente.`.
- El SHA-256 calculado antes de la carga fue `f5ee1af269d13f598256b429d7ca96c88e52e0aa2646a3cb9f7c0c1c2e685cac`; CloudWatch registró exactamente el mismo hash y tamaño después de que Lambda leyera S3, construyera el MIME y verificara el adjunto extraído antes de enviarlo a SES.
- Prueba negativa real con el antiguo contenido inválido de 48 bytes: autorización `200`, carga S3 `201` y submit `400` con `El CV almacenado no es un PDF válido.`; no se realizó envío SES.
- Plan Terraform posterior: `No changes`; la infraestructura real coincide con la configuración.
- Estado final: corrección desplegada y verificada. La inspección visual del nuevo mensaje y la apertura manual del adjunto en Gmail permanecen como comprobación humana opcional; la integridad hasta el mensaje raw aceptado por SES queda comprobada automáticamente en cada envío.

# CAMBIO-006 — Navegación persistente, rutas SPA y animación PMI

Implementado, desplegado y verificado el 3 de septiembre de 2026.

## Frontend y navegación

- El header compartido usa `position: sticky`, permanece visible durante todo el scroll y activa un estado compacto después de 24 px sin salir del flujo normal del documento.
- El estado compacto reduce moderadamente altura, logo y separación de navegación, con fondo opaco, borde y sombra sutiles. Los tamaños se adaptan por separado para desktop y dispositivos de hasta 860 px.
- Se añadieron offsets con `scroll-padding-top` y `scroll-margin-top` para proteger el contenido inicial, el enlace de salto y futuros anchors.
- El overlay móvil conserva bloqueo de scroll, foco, Escape y cierre al seleccionar una página; cubre el viewport completo y su botón mantiene un área táctil mínima de 44 px.
- El estado activo se calcula con la ubicación de React Router y funciona después de navegación, acceso directo, reload y atrás/adelante.
- `/sobre-nosotros` es la ruta canónica del menú. `/nosotros` continúa renderizando la misma página como alias compatible, sin recarga completa ni redirección a Home.
- La secuencia GSAP de “Proyecto exitoso” fue reordenada y acelerada: el núcleo aparece inmediatamente, anillo, estructura y cuatro dimensiones se solapan con stagger corto y la composición termina alrededor de 1.2 segundos. Se conservaron el gráfico, líneas, órbitas y soporte de `prefers-reduced-motion`.

## Terraform, AWS y despliegue

- `infra/main.tf` declara permanentemente dos `custom_error_response` en la distribución CloudFront existente: 403 y 404 entregan `/index.html` con respuesta 200 y `error_caching_min_ttl = 0`.
- El plan guardado `cambio006.tfplan` mostró `0` altas, `1` modificación en sitio y `0` bajas; únicamente cambió `aws_cloudfront_distribution.tesi_web` (`E1H2B9ZAMMEKWL`).
- El apply terminó correctamente con `0` recursos agregados, `1` modificado y `0` destruidos. El plan post-apply devolvió `No changes`.
- AWS confirmó la distribución en estado `Deployed` y las dos respuestas personalizadas con sus códigos, ruta y TTL esperados.
- El build de producción se sincronizó al bucket web existente `tesi-web-446703866994` sin eliminar objetos remotos. Los assets hash anteriores permanecen inertes y no están referenciados por el nuevo `index.html`.
- La invalidación CloudFront `I3SMV087VZHT2C9JNFGQV5VSIE` para `/*` terminó en estado `Completed`.

## Validaciones

- `npm run lint`, `npm run build`, `git diff --check`, `terraform fmt -check -recursive` y `terraform validate`: correctos.
- `npm run validate:site`: 32 combinaciones de cuatro páginas por ocho viewports sin regresiones, overflow, recursos fallidos, errores de página ni errores o warnings de consola.
- `npm run validate:change-002`: correcto en seis viewports; confirmó que el diseño del modelo PMI se conserva y reduced motion permanece operativo.
- Se creó `scripts/validate-change-006.mjs`, ejecutable mediante `npm run validate:change-006` y configurable con `TESI_BASE_URL` para validar local o producción.
- La suite específica pasó tanto en `http://localhost:3000` como en `https://dvvnw97d7nz0s.cloudfront.net`: 16 combinaciones de `/`, `/sobre-nosotros`, `/empleo` y `/contacto` en móvil, tablet, laptop y desktop.
- Cada ruta se probó mediante acceso directo y reload del navegador; todas devolvieron HTML con HTTP 200 y conservaron exactamente el pathname, sin 403, 404, XML de S3 ni `AccessDenied`.
- La navegación normal, cierre del menú móvil, ruta activa y botones atrás/adelante fueron correctos. El header permaneció en `top: 0`, redujo su altura, mantuvo offsets suficientes y no generó scroll horizontal.
- La animación PMI pública terminó en 1216 ms con núcleo y cuatro dimensiones visibles; la prueba local terminó en 1223 ms. La variante reduced motion mostró directamente todo el contenido.

## Archivos importantes modificados

- `infra/main.tf`.
- `src/App.tsx`.
- `src/components/layout/Header.tsx`.
- `src/data/site.ts`.
- `src/styles/global.css`.
- `src/animations/useAboutModelAnimations.ts`.
- `scripts/validate-change-006.mjs`.
- `package.json`.
- `PROGRESS.md`.
