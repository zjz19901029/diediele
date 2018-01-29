
import easeljs from './libs/easeljs.min'
let util = {
    getTrianglePosition(shapeData, grid_w, x = 0, y = 0) { //根据图形数据获取三角形的3个点坐标, X,Y值代表图形的位移，不然计算出来的坐标是以0，0为基础的坐标
        if (shapeData.shape != "triangle") {
            return false
        }
        let x1, y1 ,x2 ,y2 ,x3,y3
        switch (shapeData.direction) {
            case "u": //朝上
                x1 = 0
                y1 = shapeData.height * grid_w
                x2 = shapeData.width * grid_w
                y2 = shapeData.height * grid_w
                x3 = shapeData.width / 2 * grid_w
                y3 = 0
                break
            case "l": //朝左
                x1 = 0
                y1 = shapeData.height / 2 * grid_w
                x2 = shapeData.width * grid_w
                y2 = shapeData.height * grid_w
                x3 = shapeData.width * grid_w
                y3 = 0
                break
            case "r": //朝右
                x1 = 0
                y1 = 0
                x2 = shapeData.width * grid_w
                y2 = shapeData.height / 2 * grid_w
                x3 = 0
                y3 = shapeData.height * grid_w
                break
            case "d": //朝下
                x1 = 0
                y1 = 0
                x2 = shapeData.width * grid_w
                y2 = 0
                x3 = shapeData.width / 2 * grid_w
                y3 = shapeData.height * grid_w
                break
            case "l-u": //左上角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * grid_w
                y2 = 0
                x3 = 0
                y3 = shapeData.height * grid_w
                break
            case "l-d": //左下角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * grid_w
                y2 = shapeData.height * grid_w
                x3 = 0
                y3 = shapeData.height * grid_w
                break
            case "r-u": //右上角
                x1 = 0
                y1 = 0
                x2 = shapeData.width * grid_w
                y2 = shapeData.height * grid_w
                x3 = shapeData.width * grid_w
                y3 = 0
                break
            case "r-d": //右下角
                x1 = 0
                y1 = shapeData.height * grid_w
                x2 = shapeData.width * grid_w
                y2 = shapeData.height * grid_w
                x3 = shapeData.width * grid_w
                y3 = 0
                break
        }
        return {x1 : x1 + x, y1 : y1 + y, x2 : x2 + x, y2 : y2 + y, x3: x3 + x, y3: y3 + y}
    },
    computeAnswer(data) { //计算答案的所有摆放形式，因为会有相同的图形，所以存在多种摆放形式
		let items = [...data.items]
		let answer = data.answer.split("|")
		let sameRecord = util.findSameRecord(items)
		let newAnswer = util.changeLocation(answer, sameRecord)
		let answers = []
		for (let i = 0; i < newAnswer.length; i++) {
			answers.push(newAnswer[i].join("|"))
		}
		return answers
    },
    computeShapesLocation(data) { //计算初始图形的摆放位置
        let items = [...data]
        let x = 1, y = 2
        for (let i = 0; i < items.length; i++) {
            if (i % 3 == 0) {
                x = 1
            } else {
                x += 5
            }
            items[i].x = x
            items[i].y = Math.floor(i / 3) * (y + 4) + y
        }
        return items
    },

	findSameRecord(items) { //找出相同的图形生成数组,[[0,1],[2,3,4]]
		let repeatRecord = {} //用来记录已经计算过的重复项
		let computeRecord = [] //记录需要计算的重复项
		for (let i = 0; i < items.length; i++) { //遍历所有图形，并且没有被计算过
			if (repeatRecord[i]) {
				continue
			}
			let temp = [i]
			for (let j = 1; j < items.length; j++) {
				if (repeatRecord[j] || j == i) {
					continue
				}
				if (util.isSame(items[i], items[j])) { //2个图形相同
					temp.push(j) //记录相同的图形
					repeatRecord[j] = true //标识改图形已被选取，不需要再遍历
					repeatRecord[i] = true //标识改图形已被选取，不需要再遍历
				}
			}
			if (temp.length > 1) { //有2个以上相同的图形
				computeRecord.push(temp)
			}
		}
		return computeRecord
	},

	changeLocation(answer, sameRecord) { //根据找出的相同图形数据，进行位置替换，生成所有可能的答案分布
		let answers = [answer]
		for (let i = 0; i < sameRecord.length; i++) {
			let newAnswer = []
			for (let k = 0; k < answers.length; k++) { //在之前已得到的答案基础上，进行全排列
				for (let m = 0; m < sameRecord[i].length; m++) {
					for (let n = m + 1; n < sameRecord[i].length; n++) { //将相同图形进行全排列，生成对应的图形坐标数据
						let nowAnswer = [...answers[k]] //使用析构，防止更改到原始数据
						let temp = nowAnswer[sameRecord[i][m]]
						nowAnswer[sameRecord[i][m]] = nowAnswer[sameRecord[i][n]]
						nowAnswer[sameRecord[i][n]] = temp
						newAnswer.push(nowAnswer)
					}
				}
			}
			answers = answers.concat(newAnswer)
		}
		return answers
	},

	isSame(item1, item2) { //判断2个图形是否完全一致
		return (item1.width == item2.width && item1.height == item2.height && item1.shape == item2.shape && item1.direction == item2.direction)
    },
    
    drawButton(txt, width = 100, height = 40, fontSize = 20) { //绘制button
        let button = new easeljs.Container()
        let button_bg = new easeljs.Shape()
        button_bg.graphics.f("#fff").s("#000").r(0, 0, width, height)
        let text = new easeljs.Text(txt, fontSize + "px Arial", "#000")
        text.x = width / 2
        text.y = height / 2
        text.textAlign = "center"
        text.textBaseline = "middle"
        text.mouseEnabled = false
        button.addChild(button_bg, text)
        return button
    }
}
export default util