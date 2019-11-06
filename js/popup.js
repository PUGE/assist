const buttonItem = document.getElementsByTagName('button')[0]
const serverUrl = 'http://127.0.0.1:8005'

const getSchemeData = new Promise((resolve, reject) => {
  getCurrentTabId((tabInfo) => {
    fetch(`${serverUrl}/?edition=1&url=${tabInfo.url}`).then(data => data.json()).then(dataTemp => {
      dataTemp.tabInfo = tabInfo
      resolve(dataTemp)
    })
  })
})

buttonItem.onclick = function () {
  getSchemeData.then((dataTemp) => {
    if (dataTemp.err === 0) {
      // console.log(dataTemp.type)
      switch (dataTemp.type) {
        case 'run': {
          chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'img/48.png',
            title: '运行方案',
            message: '远程方案以载入并运行!'
          })
          // console.log(unescape(dataTemp.data))
          chrome.tabs.executeScript(dataTemp.tabInfo.id, {code: unescape(dataTemp.data)})
          break
        }
      }
    } else if (dataTemp.err === 999) {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/48.png',
        title: '版本过低',
        message: '有新版本请在弹出页面下载最新插件!'
      })
      // console.log(unescape(dataTemp.data))
      chrome.tabs.create({url: dataTemp.url})
    } else {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/48.png',
        title: '插件提示',
        message: unescape(dataTemp.message)
      })
    }
  })
}

let userInfo = localStorage.getItem('userInfo')
if (userInfo) {
	userInfo = JSON.parse(userInfo)
  document.getElementsByClassName('user')[0].innerHTML = `金币:  ${userInfo.gold}`
  document.getElementsByClassName('login')[0].getElementsByClassName.display = 'none'
}
// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if(callback) callback(tabs.length ? tabs[0]: null);
	})
}

// 登录按钮登录
document.getElementsByClassName('login')[0].onclick = function () {
  window.open(chrome.extension.getURL('options.html'))
}

window.onload = function() { 
  // alert("页面加载完成！"); 
  // 获取是否有脚本
  getSchemeData.then((dataTemp) => {
    const scriptBox = document.getElementsByClassName('script-box')[0]
    if (dataTemp.err !== 0) {
      scriptBox.classList.add('no-scheme')
    } else {
      scriptBox.classList.add('scheme')
    }
  })
}