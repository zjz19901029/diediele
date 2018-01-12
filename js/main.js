import databus from './databus'
import draw from './runtime/draw'
import bindEvent from './event/event'

function init() { //初始化
    draw()
    bindEvent()
}

export default init