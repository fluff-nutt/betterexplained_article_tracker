// Function to toggle the 'read' class
function toggleReadStatus(event) {
  event.preventDefault(); // Prevent the default link click behavior
  const articleElement = event.target.closest('a');
  const articleUrl = articleElement.href;

  // Check if the article is already marked as read
  if (articleElement.classList.contains('read')) {
    articleElement.classList.remove('read');
    // Remove from local storage
    chrome.storage.local.remove(articleUrl, function() {
      console.log('Article marked as unread.');
    });
  } else {
    articleElement.classList.add('read');
    // Save to local storage
    chrome.storage.local.set({[articleUrl]: true}, function() {
      console.log('Article marked as read.');
    });
  }
}

// Add event listeners to each article link
function addListeners() {
  const articles = document.querySelectorAll('.article-list a');
  articles.forEach(article => {
    article.addEventListener('click', toggleReadStatus);

    // Check if the article is stored as read
    chrome.storage.local.get(article.href, function(result) {
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
