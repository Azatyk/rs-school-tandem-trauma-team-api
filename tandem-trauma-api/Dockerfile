FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build && echo "BUILD SUCCESS" && find dist/ -name "*.js" | head -20 || echo "BUILD FAILED - dist is empty"

EXPOSE 3000

CMD ["node", "dist/main"]