# Active LTS:  https://nodejs.org/en/about/releases/
FROM node:12.13.1

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY .eslintrc.js /app/.eslintrc.js

RUN cd /app && npm install
RUN npm install pm2 -g

WORKDIR /app/lib

COPY lib /app/lib

EXPOSE 4000

ENV DEBUG express:* node server.js

CMD ["pm2-runtime", "pm2.yml"]
