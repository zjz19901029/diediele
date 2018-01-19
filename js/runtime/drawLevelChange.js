
import databus from '../databus'
let DATA = new databus()
let mask = wx.createCanvas() //过场遮罩
let level_r = 80 //显示关数圆的半径

function drawLevelChange(ctx) {
    let ctx_mask = mask.getContext('2d')
    ctx_mask.clearRect(0, 0, DATA.window_w, DATA.window_h)
    ctx_mask.globalAlpha = DATA.tweenParams.maskOpacity
    ctx_mask.fillStyle="#fff"
    ctx_mask.fillRect(0, 0, DATA.window_w, DATA.window_h)
    ctx_mask.fillStyle="#000"
    ctx_mask.arc(DATA.window_w / 2, DATA.window_h / 2, level_r, 0, 2*Math.PI)
    ctx_mask.fill()
    ctx_mask.fillStyle="#fff"
    ctx_mask.font="50px Arial"
    ctx_mask.fillText(DATA.level_now + 1, DATA.window_w / 2, DATA.window_h / 2 + 20, 160)
    ctx_mask.textAlign="center"
    ctx.drawImage(mask, 0, 0)
}
export default drawLevelChange