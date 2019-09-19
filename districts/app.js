var fs = require('fs')
const cheerio = require('cheerio')
const request = require('superagent')
require('superagent-charset')(request)
// var request = require('superagent-charset');
var district = []
var url = 'http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/2018/'
console.log('开始获取所有省份')
request
    .get(url)
    .charset('gbk')
    .end(function (err, res) {
        if (err) {
            console.log('出錯了')
        } else {
            // console.log(res)
            let $ = cheerio.load(res.text)
            $('table.provincetable .provincetr td a').each((index, element) => {
                // console.log()
                district.push({ name: $(element).text(), city: [], href: $(element).attr('href') })
            })
            // console.log(district)
            console.log('获取所有省份完成')
            getCity(0)
        }
    });
var getCity = function (index) {
    if (index == district.length) {
        console.log('結束')
        var Data = []
        district.forEach((item, index) => {
            Data.push({ name: item.name })
            let city = []
            item.city.forEach((val, key) => {
                city.push({ name: val.name })
                let area = []
                val.area.forEach(value => {
                    area.push({ name: value.name })
                })
                city[key].area = area
            })
            Data[index].city = city
        })
        var data = JSON.stringify(Data, "", "\t")

        fs.writeFile('data.json', data, function (err) {
            if (err) {
                console.log(err)
            }
        })
        return false
    } else {
        setTimeout(function () {
            console.log('开始获取' + district[index].name + '下的所有城市')
            var cityUrl = url + district[index].href
            request.get(cityUrl).charset('gbk')
                .end(function (err, res) {
                    if (err) {
                        console.log('dfsfsfsfsfsfsfsf')
                    } else {
                        let $ = cheerio.load(res.text)
                        $('table.citytable .citytr').each((i, ele) => {
                            var element = $(ele).children().eq(1).children()
                            district[index].city.push({ name: element.text(), href: element.attr('href'), area: [] })
                        })
                        console.log('获取' + district[index].name + '下的所有城市完成')

                        getArea(district[index].city, 0, index)
                    }
                })
        }, 500)

    }

}
var getArea = function (city, key, index) {
    if (key == city.length) {
        getCity(index + 1)
    } else {
        setTimeout(function () {
            console.log('开始获取' + city[key].name + '下的所有区、县')
            var areaUrl = url + city[key].href
            request.get(areaUrl).charset('gbk')
                .end(function (err, res) {
                    if (err) {
                        console.log(1111)
                    } else {
                        let $ = cheerio.load(res.text)
                        $('.countytable .countytr').each((i, ele) => {
                            let element = $(ele).children().eq(1)
                            city[key].area.push({ name: element.text() })
                        })
                        console.log('获取' + city[key].name + '下的所有区、县完成')
                        getArea(city, key + 1, index)
                    }
                })
        }, 500)

    }

}