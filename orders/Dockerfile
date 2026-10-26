# Build context is the REPO ROOT (see skaffold.yaml / docker-compose.yml) so we can reach ../common.
FROM node:20-alpine

WORKDIR /app

# 1. Build the shared common package first.
COPY common/package.json ./common/
RUN cd common && npm install
COPY common/ ./common/
RUN cd common && npm run build

# 2. Install the service. "file:../common" + install-links copies common/build into node_modules.
WORKDIR /app/auth
COPY orders/package.json orders/.npmrc ./
# Telling npm not to install development packages.
RUN npm install --omit=dev

COPY orders/ .

CMD ["npm", "start"]
