const serverUrl = 'https://going.run/assistAll'

let tempData = localStorage.getItem('tempData')
if (tempData) {
  tempData = JSON.parse(tempData)
}

function addScr (data) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.innerHTML = data;
  document.body.appendChild(script)
}

const getSchemeData = new Promise((resolve, reject) => {
  const nowTime = Date.parse(new Date())
  if (tempData && (tempData.time + 10 * 60 * 1000) > nowTime) {
    console.log('使用缓存返回!', tempData)
    resolve(tempData.data)
  }
  const urlStr = window.location.href
  fetch(`${serverUrl}?route=search`, {
    method: 'POST',
    body: JSON.stringify({
      "edition": 2,
      "url": urlStr
    }),
    redirect: 'follow'
  }).then(data => data.json()).then(dataTemp => {
    resolve(dataTemp)
  })
})



getSchemeData.then((dataTemp) => {
  let urlStr = window.location.href
  localStorage.setItem('tempData', JSON.stringify({
    time: Date.parse(new Date()),
    data: dataTemp
  }))
  urlStr = urlStr.replace('https://', '')
  urlStr = urlStr.replace('http://', '')
  dataTemp.forEach(element => {
    if (urlStr.startsWith(element.url)) {
      addScr(element.data)
      return
    }
  })
})