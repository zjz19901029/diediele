import judge from '../judge/judge'
import databus from '../databus'

let DATA = new databus()
let gameData = DATA.gameData
let startX, startY
let targetItem // 拖动的目标图形

function bindTouchEvent(shape, onChange) { //绑定触摸事件监听
    
    shape.on("mousedown", (e) => {
        if (DATA.state != "playing") { //当前禁止操作
            return false
        }
        startX = e.stageX
        startY = e.stageY
        targetItem = shape
    })

    DATA.stage.on("pressmove", (e) => {
        if (!targetItem || DATA.state != "playing") { //当前禁止操作
            return false
        }
        targetItem.x += (e.stageX - startX)
        targetItem.y += (e.stageY - startY)
        targetItem.localData.x += (e.stageX - startX) / DATA.grid_w
        targetItem.localData.y += (e.stageY - startY) / DATA.grid_w
        startX = e.stageX
        startY = e.stageY
        DATA.stage.update()
    })

    DATA.stage.on("pressup", (e) => {
        if (!targetItem || DATA.state != "playing") { //当前禁止操作
            return false
        }
        targetItem&&judge.getItemStay(targetItem)
        targetItem = null
        onChange&&onChange()
        // if (judge.judgeSuccess()) { //过关
        //     DATA.next()
        // }
    })

    // wx.onTouchStart(function(e) {
    //     if (DATA.state != "playing") { //当前禁止操作
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
    //     if (!targetItem || DATA.state != "playing") {
    //         return false
    //     }
    //     targetItem.x += (e.touches[0].clientX - startX) / DATA.grid_w
    //     targetItem.y += (e.touches[0].clientY - startY) / DATA.grid_w
    //     startX = e.touches[0].clientX
    //     startY = e.touches[0].clientY
    // })

    // wx.onTouchEnd(function() {
    //     if (!targetItem || DATA.state != "playing") {
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