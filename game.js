import './js/libs/weapp-adapter'
import init from './js/main'
import createjs from './js/libs/preloadjs.min.js'

let queue = new createjs.LoadQueue()
queue.on("complete", init, this)
// queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"})
queue.loadManifest([
    'images/triangle.png',
    'images/cube.jpg'
])

init()