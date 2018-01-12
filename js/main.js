import data from './data'
const window_w = canvas.width
const window_h = canvas.height
const playerCanvasWidth = 300
const playerCanvasHeight = 300

let playerCanvas = wx.createCanvas()
playerCanvas.width = playerCanvasWidth
playerCanvas.height = playerCanvasHeight
let ctx = playerCanvas.getContext('2d')

let ctx_bg = canvas.getContext('2d')
let playerCanvasOffset = {
    left: (window_w - playerCanvasWidth)/2,
    top: 200
}
let level_now = 0

function init() { //初始化
    draw()
    bindTouchEvent()
}

function draw() {
    drawCanvasBg()
    drawShapes()
    window.requestAnimationFrame(draw)
}

function drawCanvasBg() { //绘制画布基础背景方格
    ctx_bg.clearRect(0, 0, window_w, window_h)
    ctx_bg.fillStyle = "#ccc"
    ctx_bg.beginPath()
    ctx_bg.moveTo(playerCanvasOffset.left, playerCanvasOffset.top)
    ctx_bg.lineTo(playerCanvasOffset.left, playerCanvasOffset.top + playerCanvasHeight)
    ctx_bg.lineTo(playerCanvasOffset.left + playerCanvasWidth, playerCanvasOffset.top + playerCanvasHeight)
    ctx_bg.lineTo(playerCanvasOffset.left + playerCanvasWidth, playerCanvasOffset.top)
    ctx_bg.lineTo(playerCanvasOffset.left, playerCanvasOffset.top)
    ctx_bg.stroke()
    for (let i = 1; i < data.grid_x; i++) {
        for (let j = 1; j < data.grid_y; j++) {
            let x = i * data.grid_w
            let y = j * data.grid_w
            ctx_bg.beginPath()
            ctx_bg.arc(x + playerCanvasOffset.left, y + playerCanvasOffset.top, data.grid_r, 0, 2*Math.PI)
            ctx_bg.closePath()
            ctx_bg.fill()
        }
    }
    ctx_bg.drawImage(playerCanvas, playerCanvasOffset.left, playerCanvasOffset.top)
}

function drawShapes() { //绘制当前的图形
    let shapes = data.game_items[level_now]
    ctx.clearRect(0, 0, data.grid_w * data.grid_x, data.grid_w * data.grid_y)
    ctx.globalCompositeOperation="xor"
    for (let i = 0; i < shapes.length; i++) {
        switch (shapes[i].shape) {
            case "cube":
                drawCube(shapes[i])
                break;
            case "triangle":
                drawTriangle(shapes[i])
                break;
        }
    }
}

function bindTouchEvent() { //绑定触摸事件监听
    let startX, startY
    let targetItem // 拖动的目标图形
    let shapes = data.game_items[level_now]

    wx.onTouchStart(function(e) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        for (let i = 0; i < shapes.length; i++) {
            if (judgeItem(shapes[i], startX - playerCanvasOffset.left, startY - playerCanvasOffset.top)) { //判断是否按住某个图形
                targetItem = shapes[i]
                break
            }
        }
    })

    wx.onTouchMove(function(e) {
        if (!targetItem) {
            return
        }
        targetItem.x += (e.touches[0].clientX - startX) / data.grid_w
        targetItem.y += (e.touches[0].clientY - startY) / data.grid_w
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
    })

    // $(document).on("touchmove", function() {
    //     event.preventDefault()
    // })

    wx.onTouchEnd(function() {
        if (!targetItem) {
            return
        }
        targetItem&&getItemStay(targetItem)
        targetItem = null
        console.log(data.game_items[level_now])
        if (judgeSuccess()) { //过关
            alert("下一关")
        }
    })
}

function drawCube(itemdata) { //绘制矩形
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(itemdata.x * data.grid_w, itemdata.y * data.grid_w)
    ctx.lineTo(itemdata.x * data.grid_w, itemdata.y * data.grid_w + itemdata.height * data.grid_w)
    ctx.lineTo(itemdata.x * data.grid_w + itemdata.width * data.grid_w, itemdata.y * data.grid_w + itemdata.height * data.grid_w)
    ctx.lineTo(itemdata.x * data.grid_w + itemdata.width * data.grid_w, itemdata.y * data.grid_w)
    ctx.closePath()
    ctx.fill()
}

function drawTriangle(itemdata) { //绘制三角形
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(itemdata.x * data.grid_w + (itemdata.width * data.grid_w / 2), itemdata.y * data.grid_w)
    ctx.lineTo(itemdata.x * data.grid_w, itemdata.y * data.grid_w + itemdata.height * data.grid_w)
    ctx.lineTo(itemdata.x * data.grid_w + itemdata.width * data.grid_w, itemdata.y * data.grid_w + itemdata.height * data.grid_w)
    ctx.closePath()
    ctx.fill()
}

function judgeItem(shapeData, x, y) { //判断用户按在哪个图形上
    switch (shapeData.shape) {
        case "cube":
            return judgeCube(shapeData, x, y)
            break;
        case "triangle":
            return judgeTriangle(shapeData, x, y)
            break;
    }
}

function judgeCube(shapeData, x, y) { //判断是否在矩形内部
    if (x > shapeData.x * data.grid_w
        && x < (shapeData.x + shapeData.width) * data.grid_w
        && y > shapeData.y * data.grid_w
        && y < (shapeData.y + shapeData.height) * data.grid_w) {
        return true
    }
    return false
}

function judgeTriangle(shapeData, x, y) { //判断是否在三角形内部
    let x1 = shapeData.x * data.grid_w
    let y1 = (shapeData.y + shapeData.height) * data.grid_w
    let x2 = (shapeData.x + shapeData.width) * data.grid_w
    let y2 = (shapeData.y + shapeData.height) * data.grid_w
    let x3 = (shapeData.x + shapeData.width) * data.grid_w  / 2
    let y3 = shapeData.y * data.grid_w
    let divisor = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3)
    let a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / divisor
    let b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / divisor
    let c = 1 - a - b

    return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1
}

function getItemStay(item) { //让图形按照栅格排版
    item.x = Math.round(item.x)
    item.y = Math.round(item.y)
    if (item.x > data.grid_x - item.width) {
        item.x = data.grid_x - item.width
    } else if (item.x < 0) {
        item.x = 0
    }
    if (item.y > data.grid_y - item.height) {
        item.y = data.grid_y - item.height
    } else if (item.y < 0) {
        item.y = 0
    }
}

function judgeSuccess() { //判断是否通关
    let answers = data.answers[level_now]
    let success = true
    for (let a = 0; a < answers.length; a++) { //可能有多个摆放方式
        success = true
        let answer = data.answers[level_now][a].split(",")
        let shapes = data.game_items[level_now]
        for (let i = 0; i < shapes.length - 1; i++) {
            //判断各个图形的相对位置
            if (shapes[i + 1].x - shapes[i].x != answer[i + 1].split("|")[0] - answer[i].split("|")[0] || shapes[i + 1].y - shapes[i].y != answer[i + 1].split("|")[1] - answer[i].split("|")[1]) {
                success = false
                break
            }
        }
        if (success) {
            break
        }
    }
    return success
}

export default init