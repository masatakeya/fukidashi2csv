chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: exportStickyData,
  });
});

function exportStickyData() {
  const SELECTORS = {
    STICKY: 'g.sticky',
    CONTENT: 'p.content',
    NAME: '.name dd',
    VOTES: '.voted dd'
  };

  const CSV_HEADER = '"内容","投稿者","いいね数","背景色"';

  try {
    const stickyElements = document.querySelectorAll(SELECTORS.STICKY);
    
    if (stickyElements.length === 0) {
      showNotification('付箋が見つかりませんでした', 'warning');
      return;
    }

    const csvRows = Array.from(stickyElements).map(extractStickyData);
    const csvContent = [CSV_HEADER, ...csvRows].join('\n');
    
    copyToClipboard(csvContent);
  } catch (error) {
    console.error('エクスポートエラー:', error);
    showNotification('エクスポートに失敗しました', 'error');
  }

  function extractStickyData(stickyElement) {
    const content = getElementText(stickyElement, SELECTORS.CONTENT);
    const name = getElementText(stickyElement, SELECTORS.NAME);
    const votes = getElementText(stickyElement, SELECTORS.VOTES);
    const backgroundColor = getBackgroundColor(stickyElement);
    
    return `"${escapeCSV(content)}","${escapeCSV(name)}","${escapeCSV(votes)}","${escapeCSV(backgroundColor)}"`;
  }

  function getElementText(parent, selector) {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }

  function getBackgroundColor(stickyElement) {
    const contentElement = stickyElement.querySelector(SELECTORS.CONTENT);
    return contentElement ? contentElement.style.backgroundColor || '' : '';
  }

  function escapeCSV(text) {
    return text.replace(/"/g, '""');
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        showNotification(`${text.split('\n').length - 1}件の付箋をコピーしました！`, 'success');
      } else {
        fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.error('クリップボードコピーエラー:', error);
      fallbackCopyToClipboard(text);
    }
  }

  function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    textArea.value = text;
    
    document.body.appendChild(textArea);
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (success) {
      showNotification(`${text.split('\n').length - 1}件の付箋をコピーしました！`, 'success');
    } else {
      showNotification('クリップボードへのコピーに失敗しました', 'error');
    }
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      background-color: ${getNotificationColor(type)};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  function getNotificationColor(type) {
    const colors = {
      success: '#4CAF50',
      warning: '#FF9800', 
      error: '#F44336',
      info: '#2196F3'
    };
    return colors[type] || colors.info;
  }
}
