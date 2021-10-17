FROM node:12.22.6-alpine
ENV NODE_ENV=production
WORKDIR /mamumi
COPY . .
RUN npm install --production --silent
RUN adduser -D -H mamumi
RUN chmod 755 ./uploads ./static/audio ./db
RUN chown mamumi:mamumi ./uploads ./static/audio ./db
EXPOSE 3000
USER mamumi
CMD ["npm", "start"]
