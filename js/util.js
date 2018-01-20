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
                x1 = 0
                y1 = shapeData.height * DATA.grid_w
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height * DATA.grid_w
                x3 = shapeData.width / 2 * DATA.grid_w
                y3 = 0
                break
            case "l": //朝左
                x1 = 0
                y1 = shapeData.height / 2 * DATA.grid_w
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height * DATA.grid_w
                x3 = shapeData.width * DATA.grid_w
                y3 = 0
                break
            case "r": //朝右
                x1 = 0
                y1 = 0
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height / 2 * DATA.grid_w
                x3 = 0
                y3 = shapeData.height * DATA.grid_w
                break
            case "d": //朝下
                x1 = 0
                y1 = 0
                x2 = shapeData.width * DATA.grid_w
                y2 = 0
                x3 = shapeData.width / 2 * DATA.grid_w
                y3 = shapeData.height * DATA.grid_w
                break
            case "l-u": //左上角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * DATA.grid_w
                y2 = 0
                x3 = 0
                y3 = shapeData.height * DATA.grid_w
                break
            case "l-d": //左下角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height * DATA.grid_w
                x3 = 0
                y3 = shapeData.height * DATA.grid_w
                break
            case "r-u": //右上角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height * DATA.grid_w
                x3 = shapeData.width * DATA.grid_w
                y3 = 0
                break
            case "r-d": //右下角
                x1 = 0
                y1 = shapeData.height * DATA.grid_w
                x2 = shapeData.width * DATA.grid_w
                y2 = shapeData.height * DATA.grid_w
                x3 = shapeData.width * DATA.grid_w
                y3 = 0
                break
        }
        return {x1, y1, x2, y2, x3, y3}
    }
}
export default util