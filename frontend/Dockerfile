# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copie des dépendances et installation
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
