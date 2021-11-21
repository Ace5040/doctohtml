FROM archlinux:latest

RUN pacman --noconfirm -Syu
RUN pacman --noconfirm -S git npm python-pip libreoffice-fresh
RUN pip install unoserver

WORKDIR /doctohtml

RUN git clone https://github.com/ace5040/doctohtml.git .
WORKDIR /doctohtml/src
RUN npm install

ENV SERVER_PORT 3000
ENV PAYLOAD_MAX_SIZE 10485760
ENV PAYLOAD_TIMEOUT 300000
ENV TIMEOUT_SERVER 300000
ENV TIMEOUT_SOCKET 320000

EXPOSE 3000

ENTRYPOINT unoserver --interface 0.0.0.0 --port 2002 & node service.js
