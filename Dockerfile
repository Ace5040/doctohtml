FROM archlinux:latest

RUN pacman --noconfirm -Syu
RUN pacman --noconfirm -S git npm unoconv

WORKDIR /doctohtml

ARG test002

RUN git clone -b legacy https://github.com/ace5040/doctohtml.git .
WORKDIR /doctohtml/service
RUN npm install

ENV SERVER_PORT 3000
ENV PAYLOAD_MAX_SIZE 10485760
ENV PAYLOAD_TIMEOUT 300000
ENV TIMEOUT_SERVER 300000
ENV TIMEOUT_SOCKET 320000

EXPOSE 3000

ENTRYPOINT unoconv --listener --server=0.0.0.0 --port=2002 & node service.js
