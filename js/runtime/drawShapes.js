import databus from '../databus'
import util from '../util'

let scale = 1
let cloneCanvas = wx.createCanvas()
let answerCanvas = wx.createCanvas()

//绘制当前的图形, 因为小游戏中只有一个canvas的原因，直接使用XOR模式绘制，会导致背景和游戏图片重叠，所以这里在离屏canvas上绘制出图形，然后生成图片绘制到主舞台
function drawShapes(shapes) { 
    let ctx = cloneCanvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = "xor"
    draw(shapes, ctx)
    return cloneCanvas
}

function draw(shapes, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < shapes.length; i++) {
        let shape
        switch (shapes[i].shape) {
            case "cube":
                drawCube(shapes[i], ctx)
                break;
            case "triangle":
                drawTriangle(shapes[i], ctx)
                break;
        }
    }
}

function drawCube(itemdata, ctx) { //绘制矩形
    let DATA = new databus()
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.rect(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w, itemdata.height * DATA.grid_w)
    ctx.closePath()
    ctx.fill()
}

function drawTriangle(itemdata, ctx) { //绘制三角形
    let DATA = new databus()
    let position = util.getTrianglePosition(itemdata, DATA.grid_w, itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(position.x1, position.y1)
    ctx.lineTo(position.x2, position.y2)
    ctx.lineTo(position.x3, position.y3)
    ctx.closePath()
    ctx.fill()
}

function drawAnswer(gameData) { //生成答案图片
    let DATA = new databus()
    let answer = gameData.answers[0].split("|")
    let shapes = []
    let minX, minY, maxX, maxY
    for (let i = 0; i < answer.length; i++) {
        shapes[i] = {...gameData.items[i]}
        let x = +answer[i].split(",")[0]
        let y = +answer[i].split(",")[1]
        shapes[i].x = x
        shapes[i].y = y
        if (!minX || x < minX) { //判断当前图形的左边X坐标是否是整体的最左边
            minX = x
        }
        if (!maxX || x + shapes[i].width > maxX) { //判断当前图形的右边X坐标是否是整体的最右边
            maxX = x + shapes[i].width
        }
        if (!minY || y < minY) { //判断当前图形的上边Y坐标是否是整体的最上边
            minY = y
        }
        if (!maxY || y + shapes[i].height > maxY) { //判断当前图形的下边Y坐标是否是整体的最下边
            maxY = y + shapes[i].height
        }
    }
    let finalX = 0 //计算最终位移的X坐标
    let finalY = 0 //计算最终位移的Y坐标
    let minusX = finalX - minX //根据最小X坐标计算应该整体位移的X值
    let minusY = finalY - minY //根据最小Y坐标计算应该整体位移的Y值
    let width = (maxX - minX) * DATA.grid_w //图案的宽度
    let height = (maxY - minY) * DATA.grid_w //图案的高度
    shapes.map((shape) => { //所有图形整体位移
        shape.x += minusX
        shape.y += minusY
    })
    let ctx = answerCanvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = "xor"
    draw(shapes, ctx)
    return {
        canvas: answerCanvas,
        width,
        height
    }
}

// function drawCube(itemdata, drawArea) { //绘制矩形
//     //let s = new easeljs.Bitmap("images/cube.jpg")
//     let s = new easeljs.Shape()
//     s.localData = itemdata
//     //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
//     s.graphics.f("#000").r(0, 0, itemdata.width * DATA.grid_w, itemdata.height * DATA.grid_w)
//     s.x = itemdata.x * DATA.grid_w
//     s.y = itemdata.y * DATA.grid_w
//     return s
// }

// function drawTriangle(itemdata, drawArea) { //绘制三角形
//    // let s = new easeljs.Bitmap("images/triangle.png")
//     let s = new easeljs.Shape()
//     s.localData = itemdata
//     let position = util.getTrianglePosition(itemdata, DATA.grid_w * scale)
//     s.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
//     s.x = itemdata.x * DATA.grid_w * scale
//     s.y = itemdata.y * DATA.grid_w * scale
//     //s.setTransform(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w / 297, itemdata.height * DATA.grid_w / 297)
//     return s
// }

export default {
    drawShapes,
    drawAnswer
}