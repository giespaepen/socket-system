FROM node:10.16.3-alpine as build
COPY . /app
WORKDIR /app
RUN npm --prefix socket-common ci && \
    npm --prefix socket-common run build:dev && \
    npm --prefix socket-common prune --production && \
    npm --prefix socket-sink ci && \
    npm --prefix socket-sink run build:dev && \
    npm --prefix socket-sink prune --production && \
    npm --prefix socket-server ci && \
    npm --prefix socket-server run build:dev && \
    npm --prefix socket-server prune --production
FROM node:10.16.3-alpine as run
COPY --from=build /app /app
WORKDIR /app
ENTRYPOINT [ "/bin/sh" ]
CMD ["start.sh"]