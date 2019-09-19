var WechatAPI = require('co-wechat-api');
const fs = require('fs')
const axios = require('axios')
 let getToken  = async function() {
    const wxAppAPI = new WechatAPI('wx7b4f6c0e3b81c3dd', '14cc893443b65904e0999365106d7f70')
    const token = await wxAppAPI.ensureAccessToken()

    let url = 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=' + token.accessToken
    // 发送POST请求
    const response = await axios.post(url, {
       path: 'pages/ucenter/index/index' 
    }, { responseType: 'stream' })
    
    // 将请求结果中的二进制流写入到本地文件qrcode.png
    // console.log(response.data)
    response.data.pipe(fs.createWriteStream('qrcode.png'))

}
getToken ()