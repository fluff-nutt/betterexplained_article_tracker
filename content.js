// Function to toggle the 'read' class
function toggleReadStatus(event) {
  const articleElement = event.target.closest('a');
  const articleUrl = articleElement.href;

  // Toggle the 'read' class regardless of the click
  if (articleElement.classList.contains('read')) {
    articleElement.classList.remove('read');
    // Remove from synced storage
    chrome.storage.sync.remove(articleUrl, function() {
      console.log('Article marked as unread.');
    });
  } else {
    articleElement.classList.add('read');
    // Save to synced storage
    chrome.storage.sync.set({[articleUrl]: true}, function() {
      console.log('Article marked as read.');
    });
  }
  // No need to prevent default, the link will be followed as normal
}

// Add event listeners to each article link
function addListeners() {
  const articles = document.querySelectorAll('.article-list a');
  articles.forEach(article => {
    article.addEventListener('click', toggleReadStatus);

    // Check if the article is stored as read
    chrome.storage.sync.get(article.href, function(result) {
      if (result[article.href]) {
        article.classList.add('read');
      }
    });
  });
}

// Add the 'read' class to the CSS
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
  .read, .read h2 {
    text-decoration: line-through;
    opacity: 0.6; /* Optional: reduces the opacity of read articles */
  }
`;
document.head.appendChild(style);

// Initialize the listeners when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addListeners);
} else {
  addListeners();
}
