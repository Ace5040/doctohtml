FROM archlinux/base

RUN pacman --noconfirm -Syu
RUN pacman --noconfirm -S git npm
RUN pacman --noconfirm -S unoconv

WORKDIR /tfk-api-unoconv

RUN git clone https://github.com/zrrrzzt/tfk-api-unoconv.git .
RUN npm install --production

ENV SERVER_PORT 3000
ENV PAYLOAD_MAX_SIZE 20048576
ENV PAYLOAD_TIMEOUT 120000
ENV TIMEOUT_SERVER 120000
ENV TIMEOUT_SOCKET 140000

EXPOSE 3000

ENTRYPOINT unoconv --listener --server=0.0.0.0 --port=2002 & node standalone.js
