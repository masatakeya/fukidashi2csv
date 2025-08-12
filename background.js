chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: copyContent,
  });
});

function copyContent() {
  var stickies = document.querySelectorAll('g.sticky');
  var csvData = [];
  stickies.forEach(function(sticky) {
    var textElement = sticky.querySelector('p.content');
    var text = textElement ? textElement.textContent.trim() : '';
    var name = (sticky.querySelector('.name dd') || {}).innerText || '';
    var votes = (sticky.querySelector('.voted dd') || {}).innerText || '';
    var backgroundColor = sticky.querySelector('p.content').style.backgroundColor || '';
    csvData.push(`"${text}","${name}","${votes}","${backgroundColor}"`);
  });
  var csvContent = csvData.join('\n');
  var textArea = document.createElement('textarea');
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.opacity = 0;
  document.body.appendChild(textArea);
  textArea.value = csvContent;
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  alert('コピーしました！');
}
