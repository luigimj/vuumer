console.log('Main.js loaded successfully!');

const toggleCollapse = (collapseId) => {
  const content = document.getElementById(collapseId);
  const icon = document.getElementById('icon-' + collapseId);
  
  if (content.style.maxHeight) {
    content.style.maxHeight = null;  // Collapse
    icon.classList.remove('rotate-180');
  } else {
    content.style.maxHeight = content.scrollHeight + "px";  // Expand
    icon.classList.add('rotate-180');
  }
}

const toggles = document.querySelectorAll('.js-toggle-collapse');

toggles.forEach(toggle => {
  const collapseId = toggle.dataset.collapseId;
  toggle.addEventListener('click', () => toggleCollapse(collapseId));
});