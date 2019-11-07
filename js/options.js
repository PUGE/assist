const serverUrl = 'http://154.8.196.163:8005'
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
	fetch(`${serverUrl}/login?username=${username}&password=${password}`).then(data => data.json()).then(data => {
		if (data.err === 0) {
      localStorage.setItem('userInfo', JSON.stringify({
        gold: data.data.gold,
        userName: username,
        password: password
      }))
    } else {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/48.png',
        title: '运行方案',
        message: data.message
      })
    }
	})
}
