# Setting the base to nodejs 8.11.1
FROM node:8.11.2-alpine@sha256:72205cb4ba4e95412e4f44731c9ee4dc7840769aecfa8992294c945b25a4c177

#### Begin setup ####

# Installs git
RUN apk add --update --no-cache git

# Extra tools for native dependencies
RUN apk add --no-cache make gcc g++ python

# Bundle app source
COPY . /src

# Change working directory
WORKDIR "/src"

# Remove node_modules
RUN rm -rf node_modules

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Remove dev dependencies
RUN rm -rf node_modules

# Install dependencies
RUN npm install --production

# Env variables
ENV PORTALEN_FORSIDE_HOST localhost
ENV PORTALEN_FORSIDE_PORT 8000
ENV PORTALEN_FORSIDE_API_HOST localhost
ENV PORTALEN_FORSIDE_API_PORT 3000

EXPOSE 8080 3030

# Startup
ENTRYPOINT ["npm", "run", "start"]