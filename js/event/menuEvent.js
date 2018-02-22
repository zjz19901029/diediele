// 菜单界面的事件
import databus from '../databus'

let DATA
let startX
let targetItem // 拖动的目标图形
let moveListener, upListener, startListener // 记录监听事件
let timer = null
let speed = 0 // 计算惯性滑动的速度

export const bindEvent = function(missionsAreaPosition, onMove, onEnd){
    DATA = new databus()
    unbindEvent()

    startListener = DATA.stage.on("mousedown", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        timer&&clearTimeout(timer)
        startX = e.stageX
    })

    moveListener = DATA.stage.on("pressmove", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        missionsAreaPosition.x += speed = e.stageX - startX
        startX = e.stageX
        onMove&&onMove()
    })

    upListener = DATA.stage.on("pressup", (e) => {
        if (DATA.state != "menu") { //当前禁止操作
            return false
        }
        startMove(missionsAreaPosition, onEnd)
    })
}

export const unbindEvent = function() {
    moveListener && DATA.stage.off("pressmove", moveListener)
    upListener && DATA.stage.off("pressup", upListener)
    startListener && DATA.stage.off("mousedown", startListener)
}

function startMove(missionsAreaPosition, callback){    // 惯性移动
    timer&&clearTimeout(timer)
    missionsAreaPosition.x += speed
    speed *= 0.8
    if(Math.abs(speed) < 1) {
        speed = 0
        callback&&callback()
        clearInterval(timer)
    } else {
        timer = setTimeout(function(){
            startMove(missionsAreaPosition, callback)
        },30)
    }
    
}