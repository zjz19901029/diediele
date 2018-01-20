import './js/libs/weapp-adapter'
import init from './js/main'
import loadfile from './js/preload/preload'

loadfile([
    'images/cube.jpg',
    'images/triangle.png'
], init)