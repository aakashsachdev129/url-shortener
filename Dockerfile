FROM node:20

ENV NODE_ENV production

WORKDIR /app

# COPY package.json package-lock.json ./
COPY . .
RUN npm install

# COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
