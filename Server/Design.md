# Server Design

The server is design to run as either a websocket or webworker.

For now we'll focus on websockets.

Which means we can't use port 22 =/

Maybe I need to find a way to do that.

Not right now.

For now:

World. Ok, we need a world size limit.

# Right So Design

This is an express app with a webworker path. Static assets (such as html, js, textures) follow the normal path. Websockets for things like world data, player data.

## Connect Sequence

- Web Client Connects to server, downloads index.html, js, etc. Inits
- Requests Chunk 0,0,0
    - Chunk 0,0,0 Generation Sequence
- Player loads Chunk 0,0,0. Creates Geometry.

## Chunk Generation

Chunks have various stages of readiesness. Stage 1 is just tarrain. Stage 2 is structures. For a chunk to start Stage 2, all neighboors must complete Stage 1.

- Chunk is requested at (STAGE-1)
- Create & Return Promise
- If Chunk is not ready
    - If STAGE != 0 //todo figure out this promise sequnce
        - Request all neighbors are at Generation (STAGE-1)
        - Promise Wait For Neighbors
    - Generate Chunk at STAGE and return Promise!

# Express Endpoint Map

## /

index.html, css, js, jpg, and other assets are all mounted here.

## /player

//reserved. Todo.

## /client

Websocket endpoint. See Websocket Client message list.

# Websocket Endpoint