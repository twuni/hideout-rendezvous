FROM docker.io/library/node:16.6.1-alpine3.14

WORKDIR /project

RUN npm install @hideoutchat/rendezvous@0.2.5

CMD ["node", "node_modules/@hideoutchat/rendezvous"]
