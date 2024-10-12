# Utiliza una imagen de Node.js como base
FROM node:18-bullseye

# Crea un directorio de trabajo
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa el servicio
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
