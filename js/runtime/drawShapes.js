import databus from '../databus'
import util from '../util'
import easeljs from '../libs/easeljs'

let DATA = new databus()

function drawShapes(shapes, drawArea) { //绘制当前的图形
    // let ctx = canvas.getContext('2d')
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.globalCompositeOperation="xor"
    for (let i = 0; i < shapes.length; i++) {
        let shape
        switch (shapes[i].shape) {
            case "cube":
                shape = drawCube(shapes[i], drawArea)
                break;
            case "triangle":
                shape = drawTriangle(shapes[i], drawArea)
                break;
        }
        drawArea.addChild(shape)
    }
}

function drawCube(itemdata, drawArea) { //绘制矩形
    let s = new easeljs.Shape()
    s.graphics.f("#000").r(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w, itemdata.width, itemdata.height)
    return s
    
    // ctx.fillStyle = "#000"
    // ctx.beginPath()
    // ctx.moveTo(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w)
    // ctx.lineTo(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    // ctx.lineTo(itemdata.x * DATA.grid_w + itemdata.width * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    // ctx.lineTo(itemdata.x * DATA.grid_w + itemdata.width * DATA.grid_w, itemdata.y * DATA.grid_w)
    // ctx.closePath()
    // ctx.fill()
}

function drawTriangle(itemdata, drawArea) { //绘制三角形
    let s = new easeljs.Shape()
    let position = util.getTrianglePosition(itemdata)
    s.graphics.f("#000").mt(position.x1, position.y1).lt(position.x2, position.y2).lt(position.x3, position.y3)
    //ctx.fillStyle = "#000"
    //ctx.beginPath()
    return s
    // ctx.closePath()
    // ctx.fill()
}

export default drawShapes