# Servidor de desarrollo de Vite.
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
EXPOSE 5173
# --host permite acceder al servidor desde fuera del contenedor.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
