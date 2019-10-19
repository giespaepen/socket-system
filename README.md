SocketSystem
> A simple system for scalable websockets

# Problem
Solutions for websockets are often included in the box of mature (web) frameworks. And also a breeze to setup in most of those frameworks. Scaling and routing of messages is another ball game. Althoug frameworks such as Spring provide scalable (and brokered) solutions, the backend service most of the time runs into complexities not foreseen from the beginning. Certainly when the services are hosted within a container orchestration infrastructure, Kubernetes in this case.

# Scalable Websocket Architecture
Within a Kubernetes, HTTP traffic load balanced and routed to pods. Services are stateless and can handle any call correctly. Sockets are directly terminated on the pods. But the very same client can do some work on another service and not being notified. When you need to scale this, you need a broker. You should also not grow a backend service into a scalable monolith but finding the right tools for the right job without wasting too much resources. For websockets it is wise to make a dedicated service to handle websocket connections, thus decoupling it from other services, also because of the specific nature of websockets. Between the services and the webockets is a queue. And between the queue and the service a sink.

# Solution
## 3 Component solution
As described above we have 3 components:

- A sink server
- A queue for temporal persistence
- A socket server

### Requirement of each component

- Each component should be indiviually scalable
- Integration uses standard technology
- Low resource footprint
- 1 job per component
- Simple and directed data flow
- Data agnostic, the messages can be anything, not the concern of this solution.
- One way data flow server to client

## Sink Server (socket-sink)
Exposes a simple HTTP endpoint to dump data. It exposes a simple POST endpoint:

```
POST /push/:sessionid <data>
```

The sessionid can be any URL-safe value. It can be a session id, issued in the backend service but it can be any key you want. Important, the key is intended to **only be consumed once**. I'm working on a simple broadcast solution.

The socket sink posts it to the queue.

This server is a simple ExpressJS/NodeJS implementation.

## Queue
The queue is a Redis service. Simple, it has a TTL it is small and fast. The data is pushed into a list.

## Socket server
A versatile server where you can connect to a socket with the same sessionid:

```
ws://<host>:<port>/:sessionid
```

Messages are popped from the list and delivered. This service is based on the WS package and also runs on NodeJS. 