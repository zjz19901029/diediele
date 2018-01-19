import judge from '../judge/judge'
import databus from '../databus'

let DATA = new databus()
let gameData = DATA.gameData

function bindTouchEvent(shape) { //绑定触摸事件监听
    let startX, startY
    let targetItem // 拖动的目标图形
    console.log(shape)
    shape.on("touchtsart", (e) => {
        console.log(e)
        shape.x = e.touches[0].clientX
        shape.y = e.touches[0].clientY
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