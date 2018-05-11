# Monitoring System Idea

I need a system for monitoring game data in real time.

types of metrics:
- load time metrics 
    - recorded before the first frame
    - divided into calls
- frame time metrics 
    - recorded every frame, 
    - start and finish per metric; 
- object tracking metrics 
    - location of camera, 
    - location of cross hairs
    - objects under cross hairs
- thread timing metrics 
    - probably listed like a log?
    - not sure this one actually makes sense...
- timeline system?

I'll various timing metrics need min/max/avg/mean metric kept (ie looped load step times, thread action times, etc)

```js
//Timing Example
var myTimer = new metrics.timer("named")
//do stuff
metrics.end(myTimer)
```
This would be used to create starts reusable starts and ends without collition. All "named" timers will give you a min/max/avg of matching names. (expandable list of details? we'll see)
