const tipsCanvas = wx.createCanvas() //提示区域画布
const ctx_tips = tipsCanvas.getContext('2d')

function alert(txt) {
    console.log(txt)
}

export default {
    tipsCanvas,
    alert
}