FROM node:12.22.6-alpine
ENV NODE_ENV=production
WORKDIR /mamumi
COPY . .
RUN npm install --production --silent
RUN chmod 777 ./uploads
RUN chmod 777 ./static/audio
RUN adduser -D -H mamumi
EXPOSE 3000
USER mamumi
CMD ["npm", "start"]
