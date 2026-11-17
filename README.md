# Catálogo de Apartamentos

Tercer artefacto de Programación Web II. El sitio retoma el catálogo de residenciales y apartamentos del proyecto anterior. La interfaz se rehízo con React y consume la API original en ASP.NET Core.

## Cómo ejecutarlo en Windows

Necesitas el SDK de .NET 10 y Node.js 22.12 o posterior. Descomprime el ZIP antes de abrir las terminales. La primera instalación de dependencias requiere internet.

**Terminal 1** · Desde la carpeta que contiene este archivo:

```powershell
dotnet run --project .\CatalogoApartamentosAPI --launch-profile Demostracion
```

La API se inicia en [http://localhost:5143](http://localhost:5143) y su documentación está en [Swagger](http://localhost:5143/swagger). Este perfil utiliza los datos de ejemplo del catálogo en memoria. Puedes registrar un apartamento y verlo en pantalla. Al reiniciar la API se restauran los datos de ejemplo.

**Terminal 2** · Desde la misma carpeta:

```powershell
cd .\CatalogoApartamentosReact
npm.cmd ci
npm.cmd run dev
```

Abre [http://localhost:5173](http://localhost:5173). Mantén las dos terminales abiertas. Vite reenvía las solicitudes de React que comienzan con `/api` a ASP.NET Core.

## Cómo ejecutarlo con Docker

Con Docker no hace falta instalar .NET ni Node.js. Desde la carpeta que contiene este archivo:

```bash
docker compose up -d --build
```

Abre [http://localhost:5173](http://localhost:5173). La API usa el mismo modo de demostración y Swagger sigue en [http://localhost:5143/swagger](http://localhost:5143/swagger). Después de cambiar el código, repite el comando para reconstruir las imágenes. Para detener todo usa `docker compose down`.

## Rúbrica

| Requisito | Dónde se comprueba |
|---|---|
| Landing page | Inicio, en `/`, con imagen, búsqueda rápida, cifras del catálogo y apartamentos destacados. |
| Al menos dos páginas adicionales | `/residenciales`, `/apartamentos`, `/apartamentos/:id` (detalle) y `/favoritos`. Las rutas están en `src/App.jsx`. |
| Sintaxis JSX | Los componentes y páginas de `src` usan archivos `.jsx`. Por ejemplo, `Tarjeta.jsx` imprime `{titulo}` e incluye `{children}`. |
| Props y children | `pages/Residenciales.jsx` envía `titulo`, `subtitulo` y `media` a `Tarjeta`. El párrafo, las cifras y el enlace entre las etiquetas de `Tarjeta` se reciben como `children`. |
| CSS e imágenes estáticas | `src/styles.css` y `public/imagenes/hero.svg`. La imagen viene del catálogo anterior y se usa en Inicio y en las tarjetas de residenciales. |
| Header y footer personalizados | `components/Layout.jsx`. Es una ruta de diseño: muestra el encabezado y el pie, y la página activa en `<Outlet />`. |
| Conexión con ASP.NET Core | `services/catalogoApi.js` usa `fetch` para consultar ambos recursos y registrar apartamentos. `context/CatalogoContext.jsx` lo llama y comparte el resultado. |
| Componente con contador | En Apartamentos, pulsa **+** o **−** en **Mínimo de habitaciones**. `ContadorHabitaciones` recibe el valor y la función que cambia el estado del filtro. |
| Elemento que cambia de estado | Activa o desactiva el interruptor **Solo disponibles**. `FiltroDisponibilidad` actualiza el booleano del filtro y React vuelve a calcular los resultados. |
| Cambiar visibilidad | Pulsa **Nuevo apartamento** y luego **Ocultar formulario**. `RegistroApartamento` usa `useState` y renderiza el formulario con `visible && <FormularioApartamento … />`. |
| Componente que muestra datos de la API | `ResumenCatalogo.jsx` muestra los totales reales en Inicio. Los listados, el detalle y los favoritos también muestran resultados de la API. |

## Elementos de React utilizados

| Elemento | Dónde | Para qué |
|---|---|---|
| `useState` | `RegistroApartamento.jsx`, `Residenciales.jsx`, `Layout.jsx` | Visibilidad del formulario, texto de búsqueda y menú móvil. |
| `useEffect` | `CatalogoContext.jsx`, `NotificacionesContext.jsx`, `Layout.jsx` | Consultar la API con `AbortController`, cerrar avisos con un temporizador y volver arriba al cambiar de página. |
| `useReducer` | `CatalogoContext.jsx`, `services/filtroApartamentos.js` | Concentrar los cambios del catálogo y de los filtros en una función con acciones. En Apartamentos se usa el tercer argumento para crear el estado inicial. |
| `createContext` y `useContext` | `src/context/` | Compartir el catálogo, los favoritos, el tema y los avisos sin pasar props por cada nivel. Cada contexto tiene su hook: `useCatalogo`, `useFavoritos`, `useTema` y `useNotificar`. |
| `useMemo` y `useCallback` | Contextos y páginas | Evitar recalcular filtros y estadísticas, y mantener estables las funciones que se comparten. |
| `useRef` | `RegistroApartamento.jsx`, `Residenciales.jsx`, `useNumeroAnimado.js` | Mover el foco a un campo o botón y guardar valores sin volver a renderizar. |
| `useId` | Formularios y filtros | Generar identificadores únicos para unir cada `label` con su campo. |
| `useDeferredValue` | `Residenciales.jsx` | El campo responde de inmediato mientras la lista se actualiza justo después. |
| `useActionState` | `RegistroApartamento.jsx` | Ejecutar la acción del formulario y guardar su resultado, por ejemplo un error de la API. |
| `useFormStatus` | `RegistroApartamento.jsx` (`BotonGuardar`) | El botón sabe si el formulario se está enviando y muestra **Guardando…**. |
| `useOptimistic` | `Apartamentos.jsx` | El apartamento nuevo aparece en la lista antes de que responda la API. Si falla, React lo retira. |
| `<form action={…}>` | `Inicio.jsx`, `RegistroApartamento.jsx` | Formularios que reciben los datos como `FormData`, sin `preventDefault`. |
| `lazy` y `Suspense` | `App.jsx`, `Layout.jsx` | Cada página se descarga la primera vez que se visita. Mientras tanto se ve un indicador. |
| Límite de errores | `LimiteErrores.jsx` | Si una página falla, muestra un aviso en lugar de una pantalla en blanco. La `key` lo reinicia al navegar. |
| `createPortal` | `NotificacionesContext.jsx` | Dibuja los avisos flotantes al final de `<body>`. |
| `<title>` en componentes | Todas las páginas | React 19 mueve el título al `<head>` del documento. |
| Hooks personalizados | `src/hooks/` | `useLocalStorage` guarda favoritos y tema en el navegador. `useNumeroAnimado` anima las cifras de Inicio. |
| React Router | `App.jsx` y páginas | Rutas anidadas con `<Outlet />`, parámetros con `useParams`, filtros en la URL con `useSearchParams`, navegación con `useNavigate` y datos entre páginas con `state`. |

## Cómo demostrarlo en clase

1. Abre Inicio y comprueba que aparecen 2 residenciales, 6 apartamentos y 5 disponibles con la API recién iniciada.
2. En la búsqueda rápida de Inicio elige **Torres del Cibao** y **2+** habitaciones. Se abre Apartamentos con el residencial en la URL y el contador en 2+.
3. Entra a Residenciales. Busca «santiago», sin mayúscula, y observa la coincidencia resaltada. Abre los apartamentos de Torres del Cibao. El enlace lleva el ID del residencial en la URL.
4. En Apartamentos cambia el mínimo de habitaciones, mueve el precio máximo y activa **Solo disponibles** para ver cómo cambia la lista. Prueba el orden y **Limpiar filtros**.
5. Abre y oculta el formulario. Registra un apartamento: aparece de inmediato con la etiqueta **Guardando…** y después un aviso confirma el registro. Si el número solo tiene espacios, aparece un error y los demás campos conservan sus valores.
6. Pulsa el corazón de un apartamento. El número junto a **Favoritos** cambia. Recarga la página y comprueba que el favorito sigue guardado.
7. Pulsa **Ver detalle** para abrir `/apartamentos/:id`. Cambia el tema con el botón de luna o sol del encabezado.
8. Abre Swagger y ejecuta `GET /api/Apartamentos`. Allí puedes comprobar que el nuevo registro viene de la API.
9. Detén la API y pulsa **Actualizar** en el pie. Aparece el aviso de error y el pie indica **Sin conexión con la API**. Inicia la API y pulsa **Reintentar**.

### Flujo de los datos

`CatalogoProvider` envuelve toda la aplicación en `main.jsx`. Su `useEffect` llama a `consultarCatalogo` y el servicio solicita los dos listados con `fetch`. Los controladores de ASP.NET Core devuelven JSON. El proveedor guarda el resultado con `useReducer` y lo comparte por contexto. `ResumenCatalogo` y las páginas lo leen con el hook `useCatalogo` y se vuelven a renderizar cuando cambia.

El catálogo se consulta una sola vez al abrir el sitio. Al registrar un apartamento, la respuesta de la API se agrega al estado con la acción `agregarApartamento`. Los botones **Actualizar** vuelven a consultar la API.

### Ejecutar con SQL Server

La API también conserva los servicios originales que consultan SQL Server. Puedes reutilizar tu base `CatalogoApartamentosDB`. En una instalación nueva ejecuta primero `Database/CrearBaseDatos.sql` y luego `Database/DatosIniciales.sql` desde SSMS. Estos archivos están dentro del proyecto de la API.

La conexión se configura en `CatalogoApartamentosAPI/appsettings.json`. El valor incluido usa LocalDB con autenticación de Windows. Si tu base está en otra instancia, ajusta `ConnectionStrings:DefaultConnection` o usa la variable de entorno `ConnectionStrings__DefaultConnection`. Detén la API de demostración antes de arrancar este perfil.

```powershell
dotnet run --project .\CatalogoApartamentosAPI --launch-profile "SQL Server"
```

React usa las mismas rutas en ambos perfiles.

## Material de clase

- Artefacto React. Componentes funcionales, diseño compartido, navegación y paso de `children`.
- Ejemplos de componentes. Contador, visibilidad y carga de datos con `useEffect`.
- [Componentes funcionales en React, Luis Llamas](https://www.luisllamas.es/react-componentes-funcionales/).
