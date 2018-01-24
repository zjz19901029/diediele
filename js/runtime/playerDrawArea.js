import easeljs from '../libs/easeljs.min'
import playEvent from '../event/playEvent'
import drawShapes from './drawShapes'


export default class playerDrawArea { //生成用户操作的区域
    constructor(data, onChangeCb) {
        this.stage = new easeljs.Container()
        this.data = data
        this.init(onChangeCb)
    }

    init(onChangeCb) {
        drawShapes(this.data, this.stage, playEvent, () => { //绑定操作区域的图形操作事件，以及每次操作之后的回调
            onChangeCb&&onChangeCb(this.data)
        })
    }

    getData() {
        return this.data
    }
}