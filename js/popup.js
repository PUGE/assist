const serverUrl = 'https://going.run/assist'

const getSchemeData = new Promise((resolve, reject) => {
  getCurrentTabId((tabInfo) => {
    fetch(`${serverUrl}?route=search`, {
      method: 'POST',
      body: JSON.stringify({
        "edition": 2,
        "url": tabInfo.url
      }),
      redirect: 'follow'
    }).then(data => data.json()).then(dataTemp => {
      dataTemp.tabInfo = tabInfo
      resolve(dataTemp)
    })
  })
})

let userInfo = localStorage.getItem('userInfo')
if (userInfo) {
	userInfo = JSON.parse(userInfo)
  // document.getElementsByClassName('user')[0].innerHTML = `金币:  ${userInfo.gold}`
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

let dataCopy = null

window.onload = function() { 
  // alert("页面加载完成！"); 
  // 获取是否有脚本
  getSchemeData.then((dataTemp) => {
    console.log(dataTemp)
    const scriptBox = document.getElementsByClassName('script-box')[0]
    if (dataTemp.edition > 1) {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/48.png',
        title: '版本过低',
        message: '有新版本请在弹出页面下载最新插件!'
      })
      // console.log(unescape(dataTemp.data))
      chrome.tabs.create({url: dataTemp.url})
      return
    }
    if (dataTemp.err !== 0) {
      scriptBox.classList.add('no-scheme')
    } else {
      const data = dataTemp['data']
      dataCopy = data
      let buttonHtml = ''
      let ind = 0
      data.forEach(element => {
        buttonHtml += `<button data-ind="${ind}">${element.name}</button>`
        ind++
      });
      document.querySelector('.button-box').innerHTML = buttonHtml
      scriptBox.classList.add('scheme')
      setTimeout(() => {
        const buttonList = document.getElementsByTagName('button')
        for (const key in buttonList) {
          if (Object.hasOwnProperty.call(buttonList, key)) {
            const element = buttonList[key];
            element.onclick = function () {
              
              let index = this.getAttribute("data-ind")
              index = parseInt(index)
              let dataTempCopy = dataCopy[index]
              switch (dataTempCopy.type) {
                case 'run': {
                  chrome.notifications.create(null, {
                    type: 'basic',
                    iconUrl: 'img/48.png',
                    title: '运行方案',
                    message: '远程方案以载入并运行!'
                  })
                  // console.log(unescape(dataTemp.data))
                  chrome.tabs.executeScript(dataTemp.tabInfo.id, {code: unescape(dataTempCopy.data)})
                  break
                }
              }
            }
          }
        }
      }, 0);
    }
  })
}