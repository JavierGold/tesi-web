# PLAN.md — REDISEÑO WEB TESI

# 0. ESTADO INICIAL DEL PROYECTO

Actualmente la carpeta contiene únicamente:

- CONTENT.md
- PLAN.md
- Logo/
- img/

Todavía no existe una aplicación React.

Codex debe crear desde cero la estructura de desarrollo utilizando:

- React
- Vite
- TypeScript

La aplicación debe ejecutarse localmente en:

http://localhost:3000

No realizar despliegue en Vercel durante esta primera etapa.

Primero completar y validar el sitio localmente.

El despliegue en Vercel será una fase posterior.

## 0.1 ORDEN DE TRABAJO INICIAL

1. Leer completamente CONTENT.md.
2. Leer completamente PLAN.md.
3. Leer completamente PROGRESS.md.
4. Revisar los assets existentes en Logo/ e img/.
5. Revisar las skills disponibles en el entorno de Codex.
6. Instalar o habilitar únicamente las skills aprobadas para este proyecto que todavía no estén disponibles.
7. Leer las instrucciones de las skills seleccionadas antes de comenzar a desarrollar.
8. Crear desde cero el proyecto React + Vite + TypeScript.
9. Organizar la estructura de carpetas.
10. Instalar únicamente las dependencias necesarias.
11. Configurar la aplicación para ejecutarse en localhost:3000.
12. Crear estilos globales, tipografía y paleta TESI.
13. Crear routing y estructura base.
14. Levantar la aplicación localmente.
15. Verificar que la estructura inicial funciona correctamente.
16. Comenzar la implementación visual siguiendo las fases de este PLAN.md.

## 0.2 CONTINUIDAD Y BITÁCORA DEL PROYECTO

`PROGRESS.md` es la bitácora permanente del desarrollo y debe permitir recuperar rápidamente el contexto entre sesiones.

Al iniciar una nueva sesión de trabajo, leer siempre los documentos completos en este orden:

1. `CONTENT.md`.
2. `PLAN.md`.
3. `PROGRESS.md`.

Al finalizar cada fase importante, actualizar `PROGRESS.md` automáticamente.

No registrar cambios pequeños o detalles rutinarios. Registrar únicamente:

- decisiones relevantes;
- avances importantes;
- problemas conocidos;
- pendientes que afecten las siguientes fases;
- próximos pasos.

## 1. OBJETIVO DEL PROYECTO

Rediseñar completamente el sitio web corporativo de TESI mediante React, creando una experiencia moderna, tecnológica, elegante y profesional que represente correctamente la experiencia de la empresa, especialmente en el sector bancario.

El sitio debe transmitir principalmente:

- Confianza.
- Experiencia.
- Especialización tecnológica.
- Conocimiento del sector bancario.
- Experiencia en sistemas críticos.
- Capacidad de mantenimiento y evolución de sistemas existentes.
- Experiencia en datos y procesos ETL.
- Seguridad.
- Adaptabilidad tecnológica.
- Gestión profesional de proyectos.
- Comunicación continua con el cliente.

El sitio debe ser fácil de entender y recorrer.

La innovación visual nunca debe perjudicar la claridad del contenido.

---

# 2. FUENTE DE VERDAD DEL CONTENIDO

El archivo:

`CONTENT.md`

es la fuente de verdad para todo el contenido textual del sitio.

El desarrollo debe respetar:

- páginas;
- secciones;
- títulos;
- textos;
- tecnologías;
- servicios;
- capacidades;
- formularios;
- CTAs;
- información corporativa;

definidos en `CONTENT.md`.

No modificar, eliminar o inventar contenido sin una instrucción explícita.

`PLAN.md` define cómo debe presentarse ese contenido.

---

# 3. REFERENCIA VISUAL PRINCIPAL

La principal referencia de diseño será:

Thought Machine  
https://www.thoughtmachine.net/es

Tomar como inspiración:

- jerarquía visual;
- estructura limpia;
- uso generoso de espacio;
- composición de secciones;
- títulos grandes;
- navegación;
- menú animado;
- transiciones;
- ritmo durante el scroll;
- microinteracciones;
- equilibrio entre contenido y elementos visuales;
- presentación moderna de información tecnológica.

NO copiar literalmente:

- componentes;
- ilustraciones;
- gráficos;
- animaciones;
- código;
- layouts exactos;
- identidad visual.

El resultado debe tener identidad propia de TESI.

---

# 4. PRINCIPIOS DE DISEÑO

El sitio debe sentirse:

- moderno;
- tecnológico;
- elegante;
- serio;
- corporativo;
- premium;
- confiable;
- ordenado;
- fácil de leer.

Evitar:

- exceso de información simultánea;
- animaciones agresivas;
- efectos innecesarios;
- exceso de degradados;
- estética genérica de plantilla;
- exceso de cards;
- fotografías corporativas genéricas;
- estética demasiado juvenil;
- estética excesivamente futurista;
- elementos visuales sin relación con el contenido.

Cada sección debe comunicar una idea principal.

---

# 5. IDENTIDAD VISUAL

## Paleta principal

### Azul marino principal

`#082B4C`

Uso:

- títulos;
- navegación;
- textos importantes;
- fondos oscuros;
- footer;
- elementos corporativos.

### Azul profundo secundario

`#0D3F6E`

Uso:

- elementos secundarios;
- estados hover;
- superficies;
- elementos gráficos.

### Azul eléctrico

`#2563EB`

Uso:

- CTAs;
- enlaces;
- indicadores;
- elementos interactivos;
- detalles gráficos.

### Cian tecnológico

`#22C7F2`

Uso:

- acentos;
- animaciones;
- visualizaciones;
- elementos tecnológicos;
- iluminación de elementos 3D.

### Violeta suave

`#8B5CF6`

Uso:

- acentos secundarios;
- detalles 3D;
- transiciones;
- degradados puntuales.

### Gris texto secundario

`#667085`

Uso:

- párrafos secundarios;
- etiquetas;
- información complementaria.

### Gris claro de fondos

`#F4F7FA`

Uso:

- separación de secciones;
- fondos alternativos;
- cards.

### Blanco

`#FFFFFF`

Uso:

- fondo principal;
- contraste;
- espacios de respiración.

---

# 6. USO DE DEGRADADOS

Utilizar degradados únicamente como acento.

Degradado principal TESI:

```css
linear-gradient(
  135deg,
  #2563EB 0%,
  #22C7F2 55%,
  #8B5CF6 100%
)
```

Puede utilizarse en:

- elementos 3D;
- líneas;
- pequeños detalles;
- estados hover;
- gráficos;
- indicadores;
- iluminación.

Evitar utilizar grandes fondos degradados de manera repetitiva.

---

# 7. TIPOGRAFÍA

## Color de tipografía

- Títulos principales: #082B4C
- Títulos secundarios: #082B4C
- Texto principal: #082B4C
- Texto secundario y descripciones: #667085
- Texto sobre fondos azul marino: #FFFFFF
- Links y elementos interactivos: #2563EB

Evitar negro puro (#000000) como color principal de texto.
La tipografía debe mantener coherencia con la identidad cromática del logo de TESI.

Utilizar:

**Manrope**

Preferentemente cargarla mediante una fuente web optimizada.

## Pesos

### Títulos grandes

`Manrope 600` o `Manrope 700`

### Navegación

`Manrope 500`

### Texto normal

`Manrope 400`

### Botones

`Manrope 600`

La tipografía debe tener una jerarquía clara.

Los títulos principales pueden utilizar tamaños grandes similares conceptualmente a Thought Machine, pero deben adaptarse correctamente a cada resolución.

Utilizar `clamp()` cuando resulte apropiado para obtener tipografía fluida.

---

# 8. LOGO

Utilizar como logo oficial:

`Logo/TesiLogo.svg`

El SVG será la versión principal.

Utilizar PNG únicamente como fallback cuando sea necesario.

El logo debe:

- conservar proporciones;
- nunca deformarse;
- disponer de espacio alrededor;
- ser legible en desktop y móvil.

Al hacer clic en el logo:

- navegar siempre a `/`;
- no abrir pestaña nueva;
- no navegar a páginas externas.

---

# 9. ASSETS TECNOLÓGICOS

Actualmente existen recursos dentro de:

`img/`

Incluyendo:

- Ab Initio;
- COBOL;
- Kafka;
- HPE NonStop / Tandem;
- Teradata;
- Unisys.

Al crear la aplicación React, reorganizar estos assets de manera limpia dentro de la estructura final del proyecto.

Preferir:

- SVG cuando esté disponible;
- PNG transparente;
- imágenes optimizadas.

No deformar logos.

No modificar colores de marcas oficiales de manera arbitraria.

Las tecnologías principales deben tener mayor jerarquía visual que las tecnologías complementarias.

---

# 10. STACK PRINCIPAL

Utilizar:

- React
- Vite
- TypeScript

No utilizar Create React App.

Configurar el servidor de desarrollo para ejecutarse en:

`http://localhost:3000`

---

# 11. LIBRERÍAS

Utilizar únicamente cuando aporten valor real.

## Navegación

React Router.

## Animaciones complejas

GSAP.

## Scroll

GSAP ScrollTrigger.

## 3D

Three.js.

React Three Fiber.

Drei.

## Microinteracciones

Motion puede utilizarse para:

- botones;
- fades simples;
- pequeñas transiciones;
- estados de componentes.

Evitar duplicar innecesariamente animaciones entre Motion y GSAP.

GSAP debe controlar las secuencias complejas.

## Formularios

React Hook Form.

## Validación

Zod.

---

# 12. ESTRUCTURA DE PÁGINAS

El sitio tendrá cuatro páginas principales:

1. Home
2. Sobre nosotros
3. Empleo
4. Contacto

Rutas:

```text
/
/nosotros
/empleo
/contacto
```

No crear páginas adicionales sin autorización.

---

# 13. HEADER

Crear un header limpio y moderno.

Debe contener:

- logo TESI;
- navegación;
- acceso a Contacto;
- control de menú cuando corresponda.

El header debe integrarse visualmente con el Hero.

Puede cambiar sutilmente de apariencia después de comenzar el scroll.

Debe permanecer completamente usable en:

- desktop;
- tablet;
- móvil.

---

# 14. MENÚ

La experiencia de apertura y cierre del menú debe inspirarse en Thought Machine.

No copiar literalmente su implementación.

Crear una experiencia TESI propia.

## Comportamiento

Al abrir:

1. bloquear temporalmente el scroll de la página;
2. mostrar un overlay/panel;
3. animar su entrada;
4. revelar progresivamente las opciones;
5. mostrar microanimaciones elegantes;
6. permitir cerrar mediante un control claramente visible.

Opciones:

- Home
- Sobre nosotros
- Empleo
- Contacto

Las entradas pueden aparecer de manera escalonada.

La animación debe sentirse:

- suave;
- rápida;
- precisa;
- elegante.

No debe sentirse pesada.

---

# 15. SISTEMA GENERAL DE ANIMACIONES

Las animaciones son parte importante de la experiencia.

Sin embargo:

**claridad > animación**

Utilizar animaciones delicadas durante el desplazamiento.

Ejemplos:

- títulos que aparecen suavemente;
- textos con pequeño desplazamiento vertical;
- cards con entrada progresiva;
- líneas que se expanden;
- números que aparecen;
- elementos gráficos que reaccionan al scroll;
- pequeños cambios de escala;
- transiciones entre secciones.

Evitar:

- rebotes exagerados;
- movimientos bruscos;
- rotaciones innecesarias;
- efectos llamativos sin propósito.

---

# 16. ACCESIBILIDAD DE MOVIMIENTO

Respetar:

`prefers-reduced-motion`

Cuando esté activado:

- reducir animaciones;
- eliminar movimientos 3D innecesarios;
- evitar efectos de parallax;
- mantener completamente accesible el contenido.

---

# 17. ELEMENTOS 3D

Incorporar elementos 3D originales utilizando:

- Three.js;
- React Three Fiber;
- Drei.

Los elementos 3D NO deben ser objetos decorativos aleatorios.

Cada elemento debe tener relación conceptual con la información que acompaña.

Ejemplos conceptuales:

- flujo de información;
- procesamiento de datos;
- sistemas conectados;
- capas tecnológicas;
- infraestructura;
- continuidad;
- transformación;
- redes;
- procesamiento;
- integración.

Utilizar principalmente:

- azul;
- cian;
- violeta;
- transparencias;
- materiales suaves;
- iluminación elegante.

Inspiración visual general:

tecnología financiera moderna como ClearBank y Thought Machine.

No copiar elementos existentes.

---

# 18. RENDIMIENTO DEL 3D

El 3D nunca debe perjudicar significativamente:

- carga;
- navegación;
- móvil;
- accesibilidad.

Aplicar:

- lazy loading;
- geometrías optimizadas;
- limitar polígonos;
- limitar luces;
- evitar texturas innecesariamente grandes;
- detener o reducir animaciones fuera del viewport;
- reducir complejidad en dispositivos menos potentes.

En móvil puede utilizarse una versión simplificada del elemento.

---

# 19. HOME

Ruta:

`/`

La estructura debe seguir exactamente las seis secciones definidas en `CONTENT.md`.

---

## HOME — SECCIÓN 1 — HERO

Objetivo:

Explicar inmediatamente qué es TESI y transmitir tecnología, confianza y especialización.

### Layout

Desktop:

- contenido textual con gran protagonismo;
- elemento visual/3D complementario;
- composición espaciosa;
- evitar saturación.

Mobile:

- texto primero;
- visual después;
- CTA claramente visible.

### Visual 3D

Crear una animación abstracta relacionada con:

- sistemas bancarios;
- procesamiento;
- flujo de datos;
- continuidad tecnológica.

No representar literalmente un banco.

Puede utilizar:

- capas;
- nodos;
- estructuras;
- partículas controladas;
- elementos modulares;
- flujos.

La animación debe tener:

- movimiento continuo muy lento;
- reacción sutil al cursor en desktop;
- pequeñas transformaciones asociadas al scroll.

### Entrada

Animar:

- título;
- descripción;
- CTAs;
- elemento visual.

Utilizar secuencia suave.

---

# 20. HOME — SECCIÓN 2 — CAPACIDADES

Mostrar las cuatro capacidades definidas en `CONTENT.md`.

Actualmente:

1. Sistemas críticos.
2. Gestión eficiente de proyectos.
3. Adaptabilidad tecnológica.
4. Comunicación continua.

### Diseño

Utilizar cuatro bloques/cards.

Desktop:

2x2 o composición equivalente que mantenga claridad.

Tablet:

adaptación según espacio disponible.

Mobile:

una columna.

### Cada card

Debe incluir:

- icono;
- título;
- descripción.

Utilizar iconografía moderna, minimalista y coherente.

No utilizar emojis.

### Interacción

Hover sutil:

- pequeño desplazamiento;
- cambio de borde;
- detalle de color;
- microanimación del icono.

La información debe aparecer progresivamente durante el scroll.

---

# 21. HOME — SECCIÓN 3 — TECNOLOGÍAS

Esta sección debe tener gran importancia porque representa una ventaja competitiva de TESI.

Diferenciar entre:

## Tecnologías principales

Dar mayor protagonismo a:

- Unisys;
- HPE NonStop / Tandem;
- COBOL;
- ALGOL;
- Teradata;
- Ab Initio.

## Tecnologías complementarias

Mostrar de forma secundaria las definidas en `CONTENT.md`, incluyendo cuando corresponda:

- ETL;
- Java;
- arquitectura SOA;
- APIs REST;
- Kafka;
- bases de datos;
- Git;
- Bitbucket;
- Jira;
- CI/CD;
- seguridad;
- integración.

### Diseño

No presentar una lista aburrida.

Crear una composición tecnológica moderna.

Puede combinar:

- logos oficiales;
- nombres;
- pequeños bloques;
- movimiento horizontal muy sutil;
- apariciones progresivas;
- elementos visuales relacionados con datos.

Las tecnologías principales deben destacar inmediatamente.

### Logos

Utilizar los assets disponibles en `img/`.

Cuando no exista logo disponible:

- utilizar nombre tipográfico temporal;
- no inventar logos.

---

# 22. HOME — SECCIÓN 4 — SERVICIOS

Utilizar exclusivamente los servicios definidos finalmente en `CONTENT.md`.

La sección debe ser fácil de escanear.

### Diseño

Preferentemente utilizar cuatro bloques principales.

Cada servicio:

- icono;
- título;
- descripción breve.

No crear demasiado texto visual simultáneamente.

Desktop:

composición equilibrada.

Mobile:

una columna.

### Interacción

Animación de entrada progresiva.

Hover elegante y discreto.

Los iconos pueden incorporar pequeños detalles animados.

---

# 23. HOME — SECCIÓN 5 — EXPERIENCIA Y CONFIANZA

Objetivo:

Transmitir trayectoria y reducir percepción de riesgo para clientes empresariales y financieros.

Utilizar las cifras y textos existentes en `CONTENT.md`.

### Diseño

Dar protagonismo a los números.

Los números pueden utilizar tipografía de gran tamaño.

los numeros deberan tener una animacion de conteo

Ejemplo conceptual:

`18+`

con descripción debajo.

### Animación

Los números pueden:

- aparecer progresivamente;
- utilizar count-up únicamente si no resulta artificial.

No sacrificar legibilidad por la animación.

Esta sección puede utilizar un fondo azul marino para crear contraste con las secciones claras.

---

# 24. HOME — SECCIÓN 6 — CTA FINAL

Cerrar Home con una llamada clara a Contacto.

### Diseño

Sección amplia y limpia.

Puede utilizar:

- azul marino;
- elemento visual abstracto;
- degradado sutil;
- línea animada.

Debe contener:

- título;
- descripción;
- CTA.

El botón debe navegar a:

`/contacto`

---

# 25. SOBRE NOSOTROS

Ruta:

`/nosotros`

Seguir exactamente las secciones de `CONTENT.md`.

El objetivo de esta página es explicar:

- quién es TESI;
- cómo comenzó;
- cómo ha evolucionado;
- cómo trabaja;
- qué la diferencia;
- sus principios.

---

# 26. SOBRE NOSOTROS — INTRODUCCIÓN

Crear un Hero interior más compacto que Home.

Debe:

- utilizar título grande;
- incluir descripción;
- incorporar un elemento gráfico tecnológico sutil.

No repetir exactamente el Hero de Home.

---

# 27. SOBRE NOSOTROS — HISTORIA

La historia NO debe mostrarse únicamente mediante grandes párrafos.

Utilizar el texto introductorio de `CONTENT.md` y posteriormente convertir:

`Datos históricos`

en una línea de tiempo visual.

---

# 28. TIMELINE DE TESI

Crear una línea de tiempo moderna e interactiva.

Utilizar los hitos definidos en `CONTENT.md`.

Conceptualmente:

- 2008;
- primer año;
- segundo año;
- quinto año;
- actualidad.

### Desktop

Puede utilizar una línea horizontal o composición vinculada al scroll.

### Mobile

Convertirla en línea vertical.

### Animación

Conforme el usuario avance:

- la línea progresa;
- aparecen los hitos;
- se revelan números;
- aparece la descripción.

Puede evolucionar cromáticamente:

azul → cian → violeta.

Debe ser elegante y fácil de comprender.

No crear una animación compleja que impida leer.

---

# 29. SOBRE NOSOTROS — CÓMO TRABAJAMOS

Representar visualmente el proceso definido en `CONTENT.md`.

Las etapas pueden incluir:

- análisis;
- desarrollo;
- pruebas;
- liberación;
- mantenimiento;

según la versión final de `CONTENT.md`.

El objetivo es comunicar:

- orden;
- planificación;
- seguimiento;
- seguridad;
- calidad;
- comunicación.

Puede utilizarse una secuencia visual vinculada al scroll.

No utilizar un diagrama técnico complejo.

---

# 30. SOBRE NOSOTROS — DIFERENCIADORES

Presentar los diferenciadores definidos en `CONTENT.md`.

Utilizar bloques limpios.

Cada diferenciador puede incluir:

- número;
- icono;
- título;
- descripción.

Mantener diseño sencillo.

---

# 31. SOBRE NOSOTROS — PRINCIPIOS Y VALORES

Mostrar valores de forma visual pero sobria.

Evitar estética típica de presentación corporativa.

Utilizar:

- tipografía;
- números;
- pequeñas formas;
- iconos simples.

---

# 32. SOBRE NOSOTROS — CTA

Finalizar con CTA hacia Contacto.

Mantener coherencia con el CTA de Home, pero no necesariamente copiar exactamente el mismo diseño.

---

# 33. EMPLEO

Ruta:

`/empleo`

Objetivo:

Transmitir que TESI es un lugar atractivo para desarrollar una carrera tecnológica.

No utilizar fotografías por ahora.

Utilizar:

- tipografía;
- iconografía;
- formas;
- animaciones;
- pequeños elementos tecnológicos.

---

# 34. EMPLEO — INTRODUCCIÓN

Hero interior.

Utilizar contenido de `CONTENT.md`.

Puede incorporar una animación abstracta relacionada con:

- crecimiento;
- aprendizaje;
- colaboración.

---

# 35. EMPLEO — RAZONES PARA TRABAJAR EN TESI

Mostrar las razones definidas en `CONTENT.md`.

Utilizar cards o bloques.

Cada una:

- icono;
- título;
- descripción.

Animaciones de entrada suaves.

---

# 36. EMPLEO — PERFILES

Presentar áreas/perfiles de interés de forma escaneable.

Evitar listas excesivamente pesadas.

Puede utilizar:

- chips;
- tags;
- pequeños bloques;
- iconografía.

---

# 37. EMPLEO — FORMULARIO DE CV

El formulario debe ser funcional.

Campos según `CONTENT.md`.

Permitir adjuntar CV cuando corresponda.

Validar:

- nombre;
- correo;
- tipo de archivo;
- tamaño;
- campos obligatorios.

Para CV:

preferir PDF.

Mostrar:

- estados de carga;
- éxito;
- error.

No exponer credenciales en frontend.

La implementación final del envío debe utilizar un mecanismo compatible con Vercel.

---

# 38. CONTACTO

Ruta:

`/contacto`

La página debe tener especial cuidado visual porque representa una acción comercial.

Debe sentirse:

- sencilla;
- premium;
- rápida;
- confiable.

---

# 39. CONTACTO — INTRODUCCIÓN

Título claro.

Descripción corta.

Puede utilizar un pequeño elemento visual animado.

No distraer del formulario.

---

# 40. CONTACTO — FORMULARIO

Utilizar exactamente los campos definidos en `CONTENT.md`.

El campo:

`Tipo de necesidad`

debe utilizar las opciones finales definidas en `CONTENT.md`.

### UX

Labels siempre claros.

No depender exclusivamente de placeholders.

Mostrar errores junto al campo correspondiente.

Mostrar confirmación clara después del envío.

### Validación

Utilizar:

React Hook Form + Zod.

Validar tanto como sea posible.

No confiar exclusivamente en validación del navegador.

---

# 41. BACKEND DE FORMULARIOS

Aunque el sitio sea principalmente estático, los formularios requieren procesamiento seguro.

Preparar una solución compatible con Vercel.

Puede utilizarse:

- Vercel Functions;
- Route Handlers/API compatible con la arquitectura final;
- servicio externo seguro si posteriormente se decide.

No incluir secretos en el bundle del navegador.

Utilizar variables de entorno para cualquier credencial.

Agregar medidas anti-spam.

Considerar:

- honeypot;
- rate limiting;
- validación server-side;
- CAPTCHA únicamente si realmente resulta necesario.

---

# 42. FOOTER

Crear un footer limpio.

Debe utilizar el contenido definido en `CONTENT.md`.

Puede incluir:

- logo;
- breve descripción;
- navegación;
- información de contacto;
- LinkedIn cuando esté disponible;
- copyright.

Fondo recomendado:

azul marino principal.

adecua el color de la letra para que sea visualmente agradable y facil de leer.

Mantener contraste accesible.

---

# 43. RESPONSIVE DESIGN

El sitio debe funcionar correctamente en:

- teléfonos;
- tablets;
- laptops;
- desktops;
- pantallas grandes.

Trabajar con enfoque mobile-first cuando resulte apropiado.

No diseñar únicamente para 1920px.

Revisar como mínimo:

- 320px;
- 375px;
- 390px;
- 768px;
- 1024px;
- 1280px;
- 1440px;
- 1920px.

No permitir:

- overflow horizontal;
- texto cortado;
- botones inaccesibles;
- cards deformadas;
- elementos 3D fuera de pantalla.

---

# 44. ACCESIBILIDAD

Objetivo mínimo:

WCAG 2.2 AA cuando sea razonablemente posible.

Implementar:

- HTML semántico;
- navegación mediante teclado;
- focus visible;
- contraste suficiente;
- labels;
- aria cuando sea necesario;
- textos alternativos;
- estados accesibles de formularios;
- soporte de reduced motion.

No utilizar `div` para todo.

---

# 45. SEGURIDAD

Aunque TESI sea principalmente un sitio corporativo estático, aplicar buenas prácticas.

## Frontend

- no incluir secretos;
- no incluir API keys privadas;
- evitar `dangerouslySetInnerHTML`;
- sanitizar contenido dinámico cuando exista;
- validar URLs externas;
- utilizar dependencias mantenidas;
- revisar vulnerabilidades.

## Formularios

- validación client-side;
- validación server-side;
- protección anti-spam;
- rate limiting;
- límites de archivos;
- validar MIME/type;
- nombres de archivo seguros.

## Headers

Preparar configuración para Vercel con headers como:

- Content-Security-Policy;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Strict-Transport-Security en producción;
- protección contra framing mediante CSP.

La CSP debe configurarse cuidadosamente para no romper:

- fuentes;
- Three.js;
- analytics futuros;
- recursos necesarios.

---

# 46. PERFORMANCE

Objetivo:

obtener buenos resultados en Core Web Vitals y Lighthouse.

Aplicar:

- code splitting;
- lazy loading;
- optimización de imágenes;
- SVG cuando corresponda;
- carga diferida del 3D;
- minimizar JavaScript innecesario;
- evitar dependencias redundantes;
- tree shaking;
- optimización de fuentes;
- preload únicamente cuando aporte valor.

Evitar que GSAP, Three.js o assets 3D bloqueen la carga inicial del contenido importante.

El texto principal del Hero debe aparecer aunque el 3D todavía esté cargando.

---

# 47. SEO

Configurar:

- títulos únicos por página;
- meta descriptions;
- canonical;
- Open Graph;
- Twitter cards cuando corresponda;
- sitemap;
- robots.txt;
- favicon;
- datos estructurados apropiados para organización.

Utilizar HTML semántico.

Mantener jerarquía correcta:

`h1 → h2 → h3`

Cada página debe tener un único `h1` principal.

---

# 48. INTERNACIONALIZACIÓN FUTURA

La primera versión será únicamente en español.

Sin embargo, evitar una arquitectura que dificulte agregar inglés posteriormente.

No hardcodear textos dentro de componentes cuando puedan obtenerse desde la capa de contenido.

Mantener contenido separado de presentación.

La incorporación futura de:

`ES / EN`

debe poder realizarse sin reconstruir completamente los componentes.

No implementar selector de idioma todavía.

---

# 49. ORGANIZACIÓN DEL CÓDIGO

Mantener arquitectura clara.

Ejemplo conceptual:

```text
src/
  components/
  pages/
  sections/
  layouts/
  hooks/
  animations/
  three/
  forms/
  data/
  styles/
  utils/
```

Evitar componentes gigantes.

Separar:

- páginas;
- secciones;
- componentes reutilizables;
- lógica;
- animaciones;
- escenas 3D.

---

# 50. COMPONENTES REUTILIZABLES

Crear componentes reutilizables cuando tenga sentido.

Ejemplos:

- Header
- MenuOverlay
- Footer
- Button
- SectionHeading
- CapabilityCard
- ServiceCard
- TechnologyItem
- Timeline
- TimelineItem
- ContactForm
- CareersForm
- AnimatedSection
- 3DScene

No sobre-abstraer componentes simples.

---

# 51. CSS

Utilizar una estrategia consistente.

Definir variables globales para:

- colores;
- spacing;
- border radius;
- typography;
- container widths;
- breakpoints cuando corresponda.

Ejemplo:

```css
:root {
  --color-navy: #082b4c;
  --color-navy-secondary: #0d3f6e;
  --color-blue: #2563eb;
  --color-cyan: #22c7f2;
  --color-violet: #8b5cf6;
  --color-text-secondary: #667085;
  --color-background: #f4f7fa;
  --color-white: #ffffff;
}
```

Evitar valores arbitrarios repetidos.

---

# 52. ICONOGRAFÍA

No utilizar emojis como iconos.

Utilizar iconos:

- lineales;
- minimalistas;
- consistentes;
- modernos.

Pueden utilizarse SVG.

Mantener el mismo lenguaje visual en todo el sitio.

Cuando sea apropiado, crear pequeños iconos propios relacionados con:

- sistemas;
- datos;
- mantenimiento;
- seguridad;
- comunicación;
- proyectos;
- tecnología.

## LIBRERÍA DE ICONOS

Utilizar Lucide React como librería principal de iconografía de interfaz.

Instalar:

npm install lucide-react

Utilizar Lucide React para iconos relacionados con:

- capacidades;
- servicios;
- seguridad;
- sistemas;
- datos;
- ETL;
- desarrollo;
- procesos;
- comunicación;
- formularios;
- navegación;
- botones y otros elementos de interfaz.

Los iconos deben mantener una estética:

- minimalista;
- tecnológica;
- elegante;
- consistente;
- principalmente lineal.

Ejemplos de asociaciones apropiadas:

- Sistemas críticos → Server
- Seguridad → ShieldCheck
- Datos / ETL → Database
- Desarrollo → Code2
- Procesos → Workflow
- Comunicación → MessagesSquare

Codex puede seleccionar otros iconos de Lucide cuando representen mejor el contenido.

No utilizar emojis como sustitutos de iconos.

No mezclar diferentes librerías de iconos salvo que exista una necesidad justificada.

### Logos de tecnologías

Lucide React NO debe utilizarse para sustituir logos de tecnologías o empresas.

Para tecnologías como:

- Unisys;
- HPE NonStop / Tandem;
- COBOL;
- Teradata;
- Ab Initio;
- Kafka;

utilizar los assets oficiales disponibles en la carpeta `img/`.

Cuando no exista un logo disponible, utilizar temporalmente el nombre de la tecnología mediante tipografía.

## No inventar, redibujar ni sustituir logos oficiales por iconos genéricos.

# 53. ESTADOS INTERACTIVOS

Todos los elementos interactivos deben tener:

- default;
- hover;
- focus;
- active;
- disabled cuando corresponda.

Los botones deben sentirse rápidos.

No utilizar animaciones largas para acciones básicas.

---

# 54. LINKS

Los enlaces internos deben utilizar navegación React.

No recargar innecesariamente toda la aplicación.

Los enlaces externos deben:

- ser claramente identificables cuando corresponda;
- utilizar prácticas seguras si abren nueva pestaña.

El logo siempre lleva a Home.

---

# 55. DESPLAZAMIENTO

Utilizar scroll natural del navegador.

Se pueden añadir animaciones vinculadas al scroll mediante ScrollTrigger.

No implementar scroll hijacking agresivo.

No modificar excesivamente la velocidad natural del scroll.

La página debe seguir siendo completamente navegable aunque JavaScript de animaciones falle.

---

# 56. DESPLIEGUE EN VERCEL

Preparar el proyecto desde el inicio para despliegue posterior en Vercel.

Incluir cuando sea necesario:

- configuración de rutas;
- headers;
- variables de entorno;
- funciones para formularios;
- build optimizado.

El comando de build debe ser estándar y reproducible.

La aplicación debe funcionar tanto:

localmente

como

en producción.

---

# 57. DESARROLLO LOCAL

El proyecto debe poder iniciarse mediante un comando simple.

Objetivo:

```bash
npm run dev
```

y quedar disponible en:

```text
http://localhost:3000
```

Configurar Vite para utilizar el puerto 3000.

---

# 58. SKILLS RECOMENDADAS PARA CODEX

Antes de comenzar la implementación visual, revisar las skills disponibles en el entorno de Codex.

Utilizar las skills que estén disponibles y sean apropiadas para el proyecto. Si alguna no está instalada, comprobar primero su procedencia y contenido antes de instalarla.

Las skills de diseño deben utilizarse junto con CONTENT.md y PLAN.md. Nunca deben modificar por su cuenta el contenido, identidad o estructura definida para TESI.

## Art Direction

Utilizar una skill de Art Direction para mantener una dirección visual coherente en todo el sitio.

Debe ayudar a definir y revisar:

- lenguaje visual;
- composición;
- equilibrio entre texto y elementos gráficos;
- uso del espacio;
- dirección de los elementos 3D;
- consistencia entre páginas;
- sensación tecnológica, elegante y corporativa.

La identidad debe seguir siendo TESI.

Thought Machine, ClearBank y otras referencias son únicamente inspiración visual.

---

## Brand Guidelines

Utilizar una skill de Brand Guidelines para mantener coherencia con la identidad de TESI.

Debe tomar como referencia principal:

- Logo/TesiLogo.svg;
- paleta definida en PLAN.md;
- tipografía Manrope;
- azul marino como color principal de texto;
- azul, cian y violeta como colores tecnológicos de acento.

Debe revisar:

- consistencia de colores;
- uso correcto del logo;
- degradados;
- botones;
- iconografía;
- elementos 3D;
- superficies;
- estados interactivos.

La identidad visual del sitio debe partir siempre del logo de TESI.

---

## Typography

Utilizar una skill especializada en Typography para revisar:

- jerarquía tipográfica;
- tamaños;
- pesos;
- interlineado;
- longitud de línea;
- espaciado;
- legibilidad;
- responsive typography.

Utilizar Manrope según las reglas establecidas en PLAN.md.

La tipografía debe tener una presencia importante en el diseño, especialmente en:

- Hero;
- títulos de sección;
- cifras;
- CTAs;
- navegación.

Evitar tamaños pequeños o bloques excesivamente densos.

---

## Editorial Design

Utilizar una skill de Editorial Design para mejorar la presentación de páginas largas.

Debe ayudar especialmente con:

- ritmo durante el scroll;
- distribución del contenido;
- espacios en blanco;
- alternancia de secciones;
- jerarquía;
- composición entre títulos, textos y gráficos;
- lectura progresiva de la información.

Aplicarla especialmente en:

- Home;
- Sobre nosotros;
- línea de tiempo;
- Servicios;
- Tecnologías.

---

## Presentation Design

Utilizar una skill de Presentation Design cuando ayude a convertir información corporativa en composiciones visuales más claras.

Debe ayudar especialmente con:

- cifras;
- capacidades;
- servicios;
- tecnologías;
- valores;
- procesos;
- hitos históricos.

No convertir el sitio en una presentación de diapositivas.

Utilizar sus principios únicamente para mejorar comunicación y jerarquía visual.

---

## Web Design Guidelines

Utilizar una skill de Web Design Guidelines, preferentemente basada en buenas prácticas modernas de interfaces web.

Debe revisar:

- layout;
- spacing;
- navegación;
- responsive;
- formularios;
- botones;
- estados interactivos;
- accesibilidad;
- consistencia;
- experiencia móvil.

Utilizarla como revisión de calidad después de construir cada página importante.

---

## React Best Practices

Utilizar una skill equivalente a:

vercel-react-best-practices

Debe revisar:

- arquitectura React;
- componentes;
- rendering;
- performance;
- bundles;
- lazy loading;
- organización;
- reutilización;
- patrones modernos de React.

No sacrificar claridad del código por optimizaciones innecesarias.

---

## Frontend Security

Utilizar una skill confiable de auditoría de seguridad frontend/web.

Debe revisar:

- formularios;
- validación;
- archivos enviados;
- exposición de secretos;
- variables de entorno;
- dependencias;
- headers;
- APIs;
- prácticas inseguras;
- configuración de producción.

Realizar una revisión de seguridad antes del despliegue.

---

## Three.js / React Three Fiber

Si existe una skill confiable especializada en:

- Three.js;
- WebGL;
- React Three Fiber;
- shaders;
- optimización 3D;

utilizarla durante la implementación de los elementos 3D.

Debe priorizar:

- rendimiento;
- responsive;
- accesibilidad;
- consumo de GPU;
- reducción de complejidad en móvil;
- lazy loading;
- correcta liberación de recursos.

No utilizar 3D únicamente para demostrar complejidad técnica.

Cada elemento 3D debe tener relación con el contenido de la sección.

---

## Image to Code

Utilizar una skill de Image to Code únicamente cuando se proporcione una referencia visual concreta que resulte útil para una sección.

Debe utilizar la imagen como referencia de:

- composición;
- proporciones;
- spacing;
- jerarquía.

No debe copiar literalmente:

- identidad;
- contenido;
- logos;
- ilustraciones;
- elementos protegidos de otros sitios.

---

## Playwright

Utilizar Playwright o una skill equivalente de browser testing para inspeccionar el resultado real en el navegador.

Debe comprobar:

- localhost:3000;
- navegación;
- menú;
- animaciones;
- formularios;
- responsive;
- overflow;
- links;
- errores visuales;
- consola del navegador.

Realizar comprobaciones en móvil, tablet y desktop.

---

## PRIORIDAD DE SKILLS

Para decisiones visuales priorizar:

1. Art Direction
2. Brand Guidelines
3. Typography
4. Web Design Guidelines
5. Editorial Design

Para implementación priorizar:

1. React Best Practices
2. Three.js / React Three Fiber cuando corresponda
3. Frontend Security
4. Playwright

Presentation Design e Image to Code son herramientas complementarias y deben utilizarse únicamente cuando aporten valor.

---

## REGLA PARA INSTALACIÓN DE SKILLS

No instalar automáticamente cualquier skill encontrada en Internet.

Antes de instalar una skill:

1. comprobar si ya está disponible;
2. verificar su procedencia;
3. revisar su SKILL.md;
4. comprobar que sea relevante para este proyecto;
5. evitar skills duplicadas;
6. evitar skills que contradigan CONTENT.md o PLAN.md.

Las skills son herramientas de apoyo.

CONTENT.md continúa siendo la fuente de verdad del contenido.

PLAN.md continúa siendo la especificación principal de diseño, arquitectura y comportamiento.

---

# 59. HERRAMIENTAS DE VALIDACIÓN

Utilizar Playwright para validar el sitio durante el desarrollo.

Comprobar:

- navegación;
- menú;
- formularios;
- links;
- responsive;
- errores visuales;
- overflow;
- comportamiento en diferentes viewports.

Realizar pruebas al menos en tamaños representativos de:

- móvil;
- tablet;
- desktop.

---

# 60. MCP Y PLUGINS

No incorporar MCPs simplemente por incorporarlos.

El desarrollo principal puede realizarse directamente mediante Codex y las librerías del proyecto.

Un MCP/plugin solo debe añadirse si resuelve una necesidad concreta.

No se necesita MCP para:

- React;
- GSAP;
- Three.js;
- React Three Fiber;
- responsive;
- animaciones.

Para esta primera versión priorizar:

- código limpio;
- skills;
- documentación oficial;
- Playwright;
- herramientas normales del proyecto.

---

# 61. CALIDAD

Antes de considerar una página terminada:

- ejecutar TypeScript;
- ejecutar lint;
- revisar consola;
- revisar responsive;
- revisar accesibilidad;
- probar navegación;
- probar formularios;
- revisar animaciones;
- revisar reduced motion;
- revisar performance.

No dejar:

- errores de consola;
- warnings evitables;
- imágenes rotas;
- links muertos;
- componentes sin utilizar;
- código comentado innecesario.

---

# 62. ORDEN DE IMPLEMENTACIÓN

No construir todo simultáneamente.

## Fase 1

Preparar:

- React;
- Vite;
- TypeScript;
- estructura;
- estilos globales;
- Manrope;
- paleta;
- routing.

## Fase 2

Crear:

- Header;
- menú animado;
- Footer;
- componentes base.

## Fase 3

Construir Home sin 3D complejo.

Validar:

- estructura;
- contenido;
- responsive;
- jerarquía.

## Fase 4

Agregar:

- animaciones;
- ScrollTrigger;
- microinteracciones.

## Fase 5

Incorporar 3D optimizado.

## Fase 6

Construir Sobre nosotros.

Incluir timeline.

## Fase 7

Construir Empleo.

Implementar formulario.

## Fase 8

Construir Contacto.

Implementar formulario.

## Fase 9

Optimización:

- responsive;
- accesibilidad;
- seguridad;
- SEO;
- performance.

## Fase 10

Preparación para Vercel.

---

# 63. REGLA DE IMPLEMENTACIÓN

No intentar replicar Thought Machine pixel por pixel.

Antes de crear cada sección:

1. consultar el contenido correspondiente en `CONTENT.md`;
2. consultar las reglas de esta sección en `PLAN.md`;
3. utilizar Thought Machine únicamente como referencia de dirección visual;
4. aplicar la identidad TESI;
5. mantener claridad;
6. validar responsive;
7. validar accesibilidad;
8. optimizar cualquier animación.

---

# 64. RESULTADO ESPERADO

El resultado final debe sentirse como una evolución completa de TESI.

Debe comunicar que TESI es una empresa:

- tecnológica;
- experimentada;
- especializada;
- confiable;
- moderna;
- preparada para trabajar con instituciones financieras;
- capaz de trabajar con tecnologías consolidadas y actuales.

La página debe combinar la seriedad necesaria para trabajar con bancos con una identidad visual contemporánea.

La experiencia debe recordar en calidad y claridad a sitios tecnológicos modernos como Thought Machine, pero debe ser claramente identificable como TESI.
