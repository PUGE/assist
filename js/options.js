//在popup.js 中调用 backgourd.js 中的变量和方法，很重要
var bg = chrome.extension.getBackgroundPage();
const serverUrl = 'https://going.run/assist'
// 登录按钮点击
document.getElementsByClassName('login-button')[0].onclick = function () {
	const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  if (!username || !password) {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'img/48.png',
      title: '运行方案',
      message: '用户名或密码不能为空!'
    })
    return
  }
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
      bg.userInfo = res.data
      bg.saveUser(username, password)
      location.reload();
    }
  })
}

if (bg.userInfo) {
  document.querySelector('.login-box').style.display = 'none'
  let newHtml = `<table border="0"><thead><tr><th>编号</th><th>脚本名称</th><th>开启状态</th></tr></thead><tbody>`
  fetch('https://going.run/assist?route=getList').then((response) => {return response.json();}).then((res) => {
    console.log(bg.openList)
    res.data.forEach(element => {
      newHtml += `<tr><td>${element.id}</td><td>${element.name}</td><td><input type="checkbox" key="${element.id}" id="check${element.id}" name="check${element.id}" ${bg.openList[element.id] ? 'checked' : ''}></td></tr>`
    });
    newHtml += `</tbody></table>`
    document.querySelector('#selectTable').innerHTML = newHtml
    document.querySelector('#selectTable').style.display = 'block'
    setTimeout(() => {
      document.querySelectorAll('table input').forEach(element => {
        element.onchange = function (e) {
          const itemId = e.target.getAttribute("key")
          bg.openList[itemId] = !bg.openList[itemId]
          bg.saveOpenList()
        }
      });
    }, 0);
  })
  
}
