# Hideout Rendezvous Node

This repo implements a rendezvous node in the Hideout network.

A rendezvous node's primary responsibility is to relay packets
between peers, through a JSON PubSub protocol wherein nodes may:

 * publish packets,
 * subscribe to packet shapes, and
 * unsubscribe from packet shapes.

Rendezvous nodes form a peer-to-peer network using secure (TLS)
web sockets with optional TLS client certificate authentication.

Peers connect to one or more rendezvous nodes in order to publish and
subscribe to packets from other peers. This forms a **logical
peer-to-peer network** among peers without connectivity to one another
at the TCP/IP layer. Within this logical network, peers should perform
their own **authentication**, **encryption**, **delivery reliability**,
and **peer discovery**. Each of these, and more, is included in the
Hideout protocol stack.

## Usage

This is a Node.js application (not a library).
The easiest way to get up and running is via the public Docker image.
Run `docker run hideoutchat/rendezvous` to spin up a local instance for
testing. **Do not run this in production!**

A production node requires some environment variables to specify
important configuration such as the TLS certificate and key, the IP
address and TCP port on which to listen, and the URL to a peer
rendezvous node on the network the node would like to join.
