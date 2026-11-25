# HuertoHogar - Frontend (React)

Evaluación Parcial 3 - DSY1104 Desarrollo Fullstack II

Tienda en línea de HuertoHogar. Este frontend consume la API REST del backend
(Spring Boot + Oracle XE), que está en el repositorio `HuertoHogar-Backend-api`.

## Integrantes
- Jazmín López
- Bryam Arciniegas

## Tecnologías
- React 19 y Vite
- react-router (navegación)
- Bootstrap
- `fetch` para llamar a la API, con el token JWT en la cabecera `Authorization`
- Vitest y Testing Library (pruebas)

## Cómo ejecutarlo

Primero hay que tener el backend encendido (ver el README del backend: base de datos Oracle,
`application-local.properties` y `./mvnw spring-boot:run`). La API queda en
`http://localhost:8085/api/v1`.

```bash
npm install
npm run dev
```

La tienda se abre en <http://localhost:5173>.

Si el backend está en otra dirección, se puede cambiar con la variable `VITE_API_URL`
en un archivo `.env` (por ejemplo `VITE_API_URL=http://localhost:8085/api/v1`).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Ejecuta las pruebas |
| `npm run cobertura` | Ejecuta las pruebas y genera el informe de cobertura |

## Sesión y roles

- El inicio de sesión (`POST /auth/login`) devuelve un token JWT. Se guarda en `localStorage`
  y se envía en cada llamada a la API.
- Al recargar la página, el frontend valida la sesión con `GET /auth/me`. Si el token expiró
  o el usuario fue desactivado, la sesión se cierra. Si falta poco para que expire, se renueva
  con `POST /auth/refresh`.
- Cada rol ve solo lo que le corresponde:

| Rol | Qué puede ver |
|---|---|
| Visitante | Tienda (productos, categorías, ofertas, carrito). Para pagar debe iniciar sesión |
| Cliente | Tienda y compra |
| Vendedor | Solo lista y detalle de productos y de órdenes (solo lectura). No ve la tienda ni el carrito, y no puede comprar |
| Administrador | Todo: usuarios, productos, categorías, reportes y órdenes |

El frontend solo oculta pantallas. La seguridad real la aplica el backend en cada llamada
(responde 401 sin sesión y 403 si el rol no tiene permiso).

Cuentas de demostración (las crea el backend al arrancar): ver la tabla del README del backend.

## Estructura de `src/`

| Carpeta | Contenido |
|---|---|
| `servicios/` | Llamadas a la API (`apiCliente.js` y un archivo por recurso) |
| `contextos/` | Estado global: sesión, catálogo y carrito |
| `rutas/` | Definición de rutas y control de acceso por rol |
| `paginas/` | Una carpeta por pantalla o módulo |
| `componentes/` | Componentes reutilizables |
| `funciones/` | Funciones de apoyo: validaciones, formato, roles, carrito |
| `pruebas/` | Configuración y pruebas |
