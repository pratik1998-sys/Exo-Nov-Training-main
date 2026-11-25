FROM registry.access.redhat.com/ubi9/nodejs-24-minimal AS catalyst_image

ARG APP_ID
ENV APP_ID=$APP_ID

USER root

WORKDIR /app

RUN chmod -R 777 /app

RUN npm install yarn -g

FROM catalyst_image as builder

# ARG APP_ID

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Bundle app source code
COPY . .

RUN yarn install

RUN yarn build:docker

FROM catalyst_image

# ARG APP_ID

USER root
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/core/scripts /app/core/scripts

ENV HOST=0.0.0.0 PORT=3000 ADMIN_PORT=4000

#RUN groupadd -g 10000 appgroup && useradd appuser --gid 10000 -u 10000
#RUN chown -R 10000 /app
#USER 10000
#RUN chmod -R 777 /app/dist
#RUN chmod -R 777 /app/package*.json

#WORKDIR /app

EXPOSE 3000
EXPOSE 4000

#TODO - Send app name from pipeline
# CMD [ "yarn", "start", "${APP_ID}", "--docker"]
CMD yarn start $APP_ID --docker