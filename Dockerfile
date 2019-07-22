FROM twuni/nodejs:12.6.0

RUN npm install @hideoutchat/rendezvous@0.1.0

ENTRYPOINT ["/bin/node", "node_modules/@hideoutchat/rendezvous"]
