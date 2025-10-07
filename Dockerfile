# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS production

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copiar package.json de producción
COPY production-package.json ./package.json

# Instalar solo dependencias de producción
RUN npm install --only=production && npm cache clean --force

# Copiar servidor y archivos construidos
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "server.js"]