import databus from '../databus'

let DATA = new databus()

function drawShapes(shapes, canvas) { //绘制当前的图形
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation="xor"
    for (let i = 0; i < shapes.length; i++) {
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
    ctx.moveTo(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w)
    ctx.lineTo(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    ctx.lineTo(itemdata.x * DATA.grid_w + itemdata.width * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    ctx.lineTo(itemdata.x * DATA.grid_w + itemdata.width * DATA.grid_w, itemdata.y * DATA.grid_w)
    ctx.closePath()
    ctx.fill()
}

function drawTriangle(itemdata, ctx) { //绘制三角形
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.moveTo(itemdata.x * DATA.grid_w + (itemdata.width * DATA.grid_w / 2), itemdata.y * DATA.grid_w)
    ctx.lineTo(itemdata.x * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    ctx.lineTo(itemdata.x * DATA.grid_w + itemdata.width * DATA.grid_w, itemdata.y * DATA.grid_w + itemdata.height * DATA.grid_w)
    ctx.closePath()
    ctx.fill()
}

export default drawShapes