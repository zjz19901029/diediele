import judge from '../judge/judge'
import databus from '../databus'

let startX, startY
let targetItem // 拖动的目标图形
let moveListener, upListener, startListener // 记录监听事件

function bindTouchEvent(shapes, x, y, onMove, onChange) { //绑定触摸事件监听
    let DATA = new databus()
    moveListener && DATA.stage.off("pressmove", moveListener)
    upListener && DATA.stage.off("pressup", upListener)
    startListener && DATA.stage.off("mousedown", startListener)
    // shape.on("mousedown", (e) => {
    //     console.log(123123)
    //     if (DATA.state != "play") { //当前禁止操作
    //         return false
    //     }
    //     startX = e.stageX
    //     startY = e.stageY
    //     targetItem = shape
    // })
    startListener = DATA.stage.on("mousedown", (e) => {
        if (DATA.state != "play" && DATA.state != "create") { //当前禁止操作
            return false
        }
        startX = e.stageX
        startY = e.stageY
        console.log(shapes)
        for (let i = 0; i < shapes.length; i++) {
            if (judge.judgeItem(shapes[i], startX - x, startY - y)) { //判断是否按住某个图形
                targetItem = shapes[i]
                break
            }
        }
    })

    moveListener = DATA.stage.on("pressmove", (e) => {
        if (!targetItem || (DATA.state != "play" && DATA.state != "create")) { //当前禁止操作
            return false
        }
        targetItem.x += (e.stageX - startX) / DATA.grid_w
        targetItem.y += (e.stageY - startY) / DATA.grid_w
        startX = e.stageX
        startY = e.stageY
        onMove&&onMove()
    })

    upListener = DATA.stage.on("pressup", (e) => {
        if (!targetItem || (DATA.state != "play" && DATA.state != "create")) { //当前禁止操作
            return false
        }
        targetItem&&judge.getItemStay(targetItem)
        targetItem = null
        onMove&&onMove()
        onChange&&onChange()
    })

    // wx.onTouchStart(function(e) {
    //     if (DATA.state != "play") { //当前禁止操作
    //         return false
    //     }
    //     let shapes = gameData.items
    //     startX = e.touches[0].clientX
    //     startY = e.touches[0].clientY
    //     for (let i = 0; i < shapes.length; i++) {
    //         if (judge.judgeItem(shapes[i], startX - DATA.playerCanvasOffset.left, startY - DATA.playerCanvasOffset.top)) { //判断是否按住某个图形
    //             targetItem = shapes[i]
    //             break
    //         }
    //     }
    // })

    // wx.onTouchMove(function(e) {
    //     if (!targetItem || DATA.state != "play") {
    //         return false
    //     }
    //     targetItem.x += (e.touches[0].clientX - startX) / DATA.grid_w
    //     targetItem.y += (e.touches[0].clientY - startY) / DATA.grid_w
    //     startX = e.touches[0].clientX
    //     startY = e.touches[0].clientY
    // })

    // wx.onTouchEnd(function() {
    //     if (!targetItem || DATA.state != "play") {
    //         return
    //     }
    //     targetItem&&judge.getItemStay(targetItem)
    //     targetItem = null
    //     console.log(gameData.items)
    //     if (judge.judgeSuccess()) { //过关
    //         DATA.next()
    //     }
    // })
}

export default bindTouchEvent