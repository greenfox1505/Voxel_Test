
let stats = new (require("stats-js"))();
stats.setMode(0); // 0: fps, 1: ms 
 
// Align top-left 
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
 
document.body.appendChild( stats.domElement );
 
let defultDisplay = stats.domElement.style.display;

module.exports = {
    begin : ()=>{stats.begin();},
    end : ()=>{stats.end();},
    show:()=>{
        stats.domElement.style.display = defultDisplay
    },
    hide:()=>{
        stats.domElement.style.display = "none";
    },
}