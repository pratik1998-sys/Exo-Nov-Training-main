FROM --platform=$BUILDPLATFORM registry.access.redhat.com/ubi10/nodejs-24-minimal:latest AS builder

USER root
WORKDIR /app

# Network installs run on the build host arch (arm64 on Apple Silicon). RHEL 10
# OpenSSL TLS fails under linux/amd64 QEMU emulation; UBI 9 did not have this issue.
RUN npm install -g yarn@1.22.22

ARG APP_ID
ENV APP_ID=$APP_ID

COPY . .

# Nested package-lock.json files (e.g. @apollo/protobufjs/cli) are unused by yarn
# and trigger false-positive CVE matches in container scanners.
RUN yarn install \
 && find node_modules -name package-lock.json -delete

RUN yarn build:docker

FROM registry.access.redhat.com/ubi10/nodejs-24-minimal:latest AS catalyst_image

ARG BASE_IMAGE_DIGEST=
ARG BASE_IMAGE_CATALOG_TAG=
ARG BASE_IMAGE_ARCH=
ARG BASE_IMAGE_BUILD_DATE=
RUN echo "=== Docker base image ===" && \
    echo "  catalog tag: ${BASE_IMAGE_CATALOG_TAG:-unknown}" && \
    echo "  digest:      ${BASE_IMAGE_DIGEST:-unknown}" && \
    echo "  arch:        ${BASE_IMAGE_ARCH:-unknown}" && \
    echo "  build date:  ${BASE_IMAGE_BUILD_DATE:-unknown}" && \
    echo "  node:        $(node --version)" && \
    echo "  os:          $(. /etc/os-release && echo "$$PRETTY_NAME")"

ARG APP_ID
ENV APP_ID=$APP_ID

USER root

WORKDIR /app

RUN chmod -R 777 /app

COPY --from=builder /opt/app-root/src/.npm-global /opt/app-root/src/.npm-global
ENV PATH=/opt/app-root/src/.npm-global/bin:$PATH

FROM catalyst_image

USER root
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package*.json /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/core/scripts /app/core/scripts

ENV HOST=0.0.0.0 PORT=3000 ADMIN_PORT=4000

EXPOSE 3000
EXPOSE 4000

CMD yarn start $APP_ID --docker
