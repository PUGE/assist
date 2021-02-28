const serverUrl = 'https://going.run/assistAll'
// let tempData = localStorage.getItem('tempData')
// if (tempData) {
//   tempData = JSON.parse(tempData)
// }


function addScr (data) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.charset = "UTF-8";
  script.innerHTML = data;
  document.body.appendChild(script)
}

chrome.runtime.sendMessage({name:"getData", url: window.location.href},function(dataTemp){
  console.log(dataTemp)
  if (!dataTemp) return
  let urlStr = window.location.href
  dataTemp.forEach(element => {
    if (new RegExp(element.url).test(urlStr)) {
      addScr(element.data)
      return
    }
  })
})