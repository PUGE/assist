var userInfo = null
var username = localStorage.getItem('owoUsername')
var password = localStorage.getItem('owoPassword')

var tempData = null
var openList = {}
if (localStorage.getItem('owoOpenList')) {
  openList = JSON.parse(localStorage.getItem('owoOpenList'))
}

function saveUser (username, password) {
  localStorage.setItem('owoUsername', username)
  localStorage.setItem('owoPassword', password)
}

function saveOpenList () {
  localStorage.setItem('owoOpenList', JSON.stringify(openList))
}


if (username && password) {
  fetch(`http://going.run/userServer?route=login`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "assist",
      username: username,
      password: password
    })
  }).then((response) => {return response.json();}).then((res) => {
    if (res.err === 0) {
      userInfo = res.data
    }
  })
}

// 对数据进行处理
function clearData (data) {
  let returnData = []
  data.forEach(element => {
    if (openList[element.id]) {
      returnData.push(element)
    }
  })
  return returnData
}

// 监听消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  switch (message.name) {
    case 'getData':
      const nowTime = Date.parse(new Date())
      if (tempData && (tempData.time + 1 * 60 * 1000) > nowTime) {
        console.log('使用缓存返回!', tempData)
        sendResponse(clearData(tempData.data))
      } else {
        const serverUrl = 'https://going.run/assistAll'
        fetch(`${serverUrl}?route=search`, {
          method: 'POST',
          body: JSON.stringify({
            "edition": 2,
            "url": message.url
          }),
          redirect: 'follow'
        }).then(data => data.json()).then(dataTemp => {
          
          tempData = {
            time: nowTime,
            data: dataTemp
          }
          sendResponse(clearData(dataTemp))
        })
      }
      break;
    default:
      break;
  }
})