# ymislucas.com 💸

El dashboard financiero diseñado para la realidad **argentina y
venezolana**. Controlá tu moneda local, internacional y crypto en un
solo lugar, sin importar en qué billetera o cuenta de un tercero
estén. Con funciones premium sin costo alguno.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Lenguaje:** TypeScript
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (Dockerized)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Validación:** [Zod](https://zod.dev/)
- **Infraestructura:** VPS con Docker

## 🏗️ Arquitectura

El proyecto sigue una estructura **orientada a features**, lo que permite un escalado robusto y desacoplado:

- `src/features/landing`: Componentes, acciones y estilos específicos de la página de inicio.
- `src/db`: Configuración de la base de datos y esquemas de Drizzle.
- `src/hooks`: Lógica de React reutilizable (ej: `useScroll`).

## 🔐 Decisiones de Ingeniería

- **Server Actions:** Implementación de flujos de datos cliente-servidor sin APIs intermedias, optimizando el bundle y la seguridad.
- **Robust Validation:** Uso de Zod para sanitización de datos y manejo de errores de base de datos (Postgres Error Codes) en el servidor.
- **UI/UX Noir:** Interfaz optimizada para el enfoque fintech, utilizando `backdrop-blur` y patrones de grilla para una experiencia premium.

## 🚀 Instalación Local

1. Clonar el repo.
2. Levantar la base de datos: `docker-compose up -d`.
3. Instalar dependencias: ` pnpm install`.
4. Configurar variables de entorno (`.env`):

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/ymislucas
   ```

5. Sincronizar DB: `npx drizzle-kit push`.
6. Correr el dev server: ` pnpm run dev`.

## 🗄️ Gestión de Base de Datos

Este proyecto utiliza **Drizzle Kit** para manejar el ciclo de vida del esquema. No se recomienda el uso de `push` en entornos que no sean de desarrollo local volátil.

### Flujo de Migraciones

Cada vez que modifiques el archivo `src/db/schema.ts`, debes seguir estos pasos:

1. **Generar la migración**: Crea el archivo SQL con los cambios detectados.
   ```bash
   npx drizzle-kit generate
   ```

---

Hecho con ❤️ y mucho café en Buenos Aires.
