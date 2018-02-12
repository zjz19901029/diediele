// 菜单界面的事件
import databus from '../databus'

let DATA
let startX
let targetItem // 拖动的目标图形
let moveListener, upListener, startListener // 记录监听事件

export const bindEvent = function(missionsAreaPosition, onMove, onEnd){
    DATA = new databus()
    unbindEvent()

    startListener = DATA.stage.on("mousedown", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        startX = e.stageX
    })

    moveListener = DATA.stage.on("pressmove", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        missionsAreaPosition.x += e.stageX - startX
        startX = e.stageX
        onMove&&onMove()
    })

    upListener = DATA.stage.on("pressup", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        onEnd&&onEnd()
    })
}

export const unbindEvent = function() {
    moveListener && DATA.stage.off("pressmove", moveListener)
    upListener && DATA.stage.off("pressup", upListener)
    startListener && DATA.stage.off("mousedown", startListener)
}