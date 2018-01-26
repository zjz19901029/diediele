import databus from '../databus'
import util from '../util'

let DATA = new databus()

let scale = 1

//绘制当前的图形, 因为小游戏中只有一个canvas的原因，直接使用XOR模式绘制，会导致背景和游戏图片重叠，所以这里在离屏canvas上绘制出图形，然后生成图片绘制到主舞台
function drawShapes(shapes) { 
    let cloneCanvas = wx.createCanvas()
    let ctx = cloneCanvas.getContext("2d")
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
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.rect(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width * DATA.grid_w, itemdata.height * DATA.grid_w)
    ctx.closePath()
    ctx.fill()
}

function drawTriangle(itemdata, ctx) { //绘制三角形
    let position = util.getTrianglePosition(itemdata, DATA.grid_w, itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w)
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(position.x1, position.y1)
    ctx.lineTo(position.x2, position.y2)
    ctx.lineTo(position.x3, position.y3)
    ctx.closePath()
    ctx.fill()
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

export default drawShapes