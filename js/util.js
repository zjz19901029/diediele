import databus from './databus'

let DATA = new databus()

let util = {
    getTrianglePosition(shapeData) { //根据图形数据获取三角形的3个点坐标
        if (shapeData.shape != "triangle") {
            return false
        }
        let x1, y1 ,x2 ,y2 ,x3,y3
        switch (shapeData.direction) {
            case "u": //朝上
                 x1 = shapeData.x * DATA.grid_w
                 y1 = (shapeData.y + shapeData.height) * DATA.grid_w
                 x2 = (shapeData.x + shapeData.width) * DATA.grid_w
                 y2 = (shapeData.y + shapeData.height) * DATA.grid_w
                 x3 = (shapeData.x + shapeData.width / 2) * DATA.grid_w
                 y3 = shapeData.y * DATA.grid_w
                break
            case "l": //朝左
                 x1 = shapeData.x * DATA.grid_w
                 y1 = (shapeData.y + shapeData.height / 2) * DATA.grid_w
                 x2 = (shapeData.x + shapeData.width) * DATA.grid_w
                 y2 = (shapeData.y + shapeData.height) * DATA.grid_w
                 x3 = (shapeData.x + shapeData.width) * DATA.grid_w
                 y3 = shapeData.y * DATA.grid_w
                break
            case "r": //朝右
                 x1 = shapeData.x * DATA.grid_w
                 y1 = shapeData.y * DATA.grid_w
                 x2 = (shapeData.x + shapeData.width) * DATA.grid_w
                 y2 = (shapeData.y + shapeData.height / 2) * DATA.grid_w
                 x3 = shapeData.x * DATA.grid_w
                 y3 = (shapeData.y + shapeData.height) * DATA.grid_w
                break
            case "d": //朝下
                 x1 = shapeData.x * DATA.grid_w
                 y1 = shapeData.y * DATA.grid_w
                 x2 = (shapeData.x + shapeData.width) * DATA.grid_w
                 y2 = shapeData.y * DATA.grid_w
                 x3 = (shapeData.x + shapeData.width / 2) * DATA.grid_w
                 y3 = (shapeData.y + shapeData.height) * DATA.grid_w
                break
        }
        return {x1, y1, x2, y2, x3, y3}
    }
}
export default util