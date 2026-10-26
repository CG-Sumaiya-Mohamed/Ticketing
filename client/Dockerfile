FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Dev server like the course app, so skaffold can sync changed files straight in.
CMD ["npm", "run", "dev"]
