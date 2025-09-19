// script.js
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link')
  const path = window.location.pathname

  // Для всех страниц постов отмечаем Blog
  if (path.includes('/posts/')) {
    const blogLink = Array.from(links).find(
      (a) =>
        (a.getAttribute('href') || '').replace('./', '/') === '/blog.html' ||
        a.textContent.trim().toLowerCase() === 'blog'
    )
    if (blogLink) blogLink.classList.add('active')
    return
  }

  // Базовая логика для остальных страниц
  links.forEach((link) => {
    const href = (link.getAttribute('href') || '').replace('./', '/')
    if (href && (path.endsWith(href) || path === href)) {
      link.classList.add('active')
    }
  })
})
