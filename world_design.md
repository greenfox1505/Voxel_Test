# World Object Design

World object maintains the World. This include chunk data and save data. It's
informed by the player. I needs to sort what chunks need to be deleted or added as
the player travels around the world.

I need a Staged Chunk Generator. Each Chunk needs certain parts of it's neighbors to complete before
continuing. Large object (such as trees) might pass between 2 or more chunks. First stage is the stone, dirt,
etc. Things that cannot extend past one chunk. Secound stage is for trees and the like. Last Stage is 
geometry (both physics and rendering, since both need to query neighbors).

# Chunk Object Design

The Chunk Object loads chunk data. When no Chunk data is provided, it runs the world Generator.

Before a chunk can be displayed, it needs to go through several stages:
- Allocates Chunk (0th stage generation, just filled out) 
- 1st Pass Chunk Generation: Noise functions, terraian, etc
- 2nd Pass Chunk Generation: objects that are larger than one chunk 
- 3rd Pass Chunk Generation: Geometry! Both physics and Redering.

To complete N pass, the neighbooring chunk must complete N-1 pass. This means
You can't generate geometry until all neighbooring chunks are past phase 2.

This means we need a messaging system. We need a way to ask for all neighbors to complete step N, then report back.

ChunkData is stored as an Octree. 


# Example Stepthrough

A stepthrough of how chunk generation happens. Player is in 0,0,0
- Reqest Chunk 0,0,0 ready for play (complete 3rd pass)
- World Allocates Chunk 0,0,0 and requests it be Stage3.
- Chunk 0,0,0 Generates Pass 1
- Chunk 0,0,0 Request Neighboors at Stage1, waits for promise
- World recives request for all 26 neighbors to pass Stage1 generatation
- World Completes All Generation Requests.
- Chunk 0,0,0 Recives promise, completes Pass2
- Chunk 0,0,0 Request Neighboors at Stage2, waits for promise
- World recives request for all 26 neighbors to pass Stage2 generatation
    - Each Chunk requests it's 26 neighbors pass Stage 1
- Chunk 0,0,0 Recives Stage 2 Promise, Completes Stage 3
- Chunk 0,0,0 Returns Stage3 generation to World
- World adds chunk to physics and rendering objects
