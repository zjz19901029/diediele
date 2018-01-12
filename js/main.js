let defaultData = {
    grid_w: 20, // 画布上每格的宽度
    grid_x: 15, //画布X轴总格数
    grid_y: 15, //画布Y轴总格数
    level_sum: 3, //总关卡
    level_now: 0, //当前关卡
    grid_r: 1 //每格的圆点半径
}
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 6000 / 60)
    }
})()

let data
let ctx, ctx_bg
let canvasOffset

function init(container, gamedata) { //初始化
    if (!$(container) || $(container).length == 0) {
        return false
    }
    data = $.extend({}, defaultData, gamedata)
    let width = data.grid_w * data.grid_x
    let height = data.grid_w * data.grid_y
    $(container).html(`<div style="position:relative;width:${width}px;height:${height}px"><canvas width="${width}" height="${height}"></canvas>
    <canvas width="${width}" height="${height}"></canvas></div>`)
    $(container).find("canvas").css({
        "position": "absolute",
        "left": 0,
        "top": 0
    })
    ctx = $(container).find("canvas")[1].getContext('2d')
    ctx_bg = $(container).find("canvas")[0].getContext('2d')
    drawCanvasBg()
    drawShapes()
    bindTouchEvent($(container).children("div"))
}

function drawCanvasBg() { //绘制画布基础背景方格
    ctx_bg.fillStyle = "#ccc"
    for (let i = 1; i < data.grid_x; i++) {
        for (let j = 1; j < data.grid_y; j++) {
            let x = i * data.grid_w
            let y = j * data.grid_w
            ctx_bg.beginPath()
            ctx_bg.arc(x, y, data.grid_r, 0, 2*Math.PI)
            ctx_bg.closePath()
            ctx_bg.fill()
        }
    }
}

function drawShapes() { //绘制当前的图形
    let shapes = data.game_items[data.level_now]
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
    window.requestAnimFrame(drawShapes)
}

function bindTouchEvent($container) { //绑定触摸事件监听
    let startX, startY
    let targetItem // 拖动的目标图形
    let shapes = data.game_items[data.level_now]
    canvasOffset = $container.offset()

    $container.on("touchstart", function() {
        startX = window.event.touches[0].clientX
        startY = window.event.touches[0].clientY
        for (let i = 0; i < shapes.length; i++) {
            if (judgeItem(shapes[i], startX - canvasOffset.left, startY - canvasOffset.top)) { //判断是否按住某个图形
                targetItem = shapes[i]
                break
            }
        }
    })

    $container.on("touchmove", function() {
        if (!targetItem) {
            return
        }
        targetItem.x += (window.event.changedTouches[0].clientX - startX) / data.grid_w
        targetItem.y += (window.event.changedTouches[0].clientY - startY) / data.grid_w
        startX = window.event.changedTouches[0].clientX
        startY = window.event.changedTouches[0].clientY
    })

    $(document).on("touchmove", function() {
        event.preventDefault()
    })

    $(document).on("touchend", function() {
        if (!targetItem) {
            return
        }
        targetItem&&getItemStay(targetItem)
        targetItem = null
        console.log(data.game_items[data.level_now])
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
    let answers = data.answers[data.level_now]
    let success = true
    for (let a = 0; a < answers.length; a++) { //可能有多个摆放方式
        success = true
        let answer = data.answers[data.level_now][a].split(",")
        let shapes = data.game_items[data.level_now]
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