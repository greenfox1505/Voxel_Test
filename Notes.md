best explanation: http://paulbourke.net/geometry/polygonise/ 

src: http://www.cs.carleton.edu/cs_comps/0405/shape/marching_cubes.html
```
// Some asci for addressing coords:
//
//                 v7_______e6_____________v6
//                  /|                    /|
//                 / |                   / |
//              e7/  |                e5/  |
//               /___|______e4_________/   |
//            v4|    |                 |v5 |e10
//              |    |                 |   |
//              |    |e11              |e9 |
//            e8|    |                 |   |
//              |    |_________________|___|
//              |   / v3      e2       |   /v2
//              |  /                   |  /
//              | /e3                  | /e1
//              |/_____________________|/
//              v0         e0          v1
//
```

