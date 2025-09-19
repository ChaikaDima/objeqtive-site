// burger.js
;(function () {
  const body = document.body
  const sidebar = document.querySelector('.sidebar')
  const burger = document.querySelector('.burger')

  if (!sidebar || !burger) return

  // a11y
  burger.setAttribute('role', 'button')
  burger.setAttribute('tabindex', '0')
  burger.setAttribute('aria-controls', 'sidebar')
  burger.setAttribute('aria-expanded', 'false')

  function openMenu() {
    sidebar.style.display = 'flex'
    sidebar.classList.remove('is-closing')
    sidebar.classList.add('open')
    burger.classList.add('is-open')
    body.classList.add('menu-open')
    burger.setAttribute('aria-expanded', 'true')
  }

  function closeMenu() {
    sidebar.classList.remove('open')
    ;+sidebar.classList.add('is-closing')
    burger.classList.remove('is-open')
    body.classList.remove('menu-open')
    burger.setAttribute('aria-expanded', 'false')
    // совпадает с animation-duration в CSS
    setTimeout(() => {
      sidebar.classList.remove('is-closing')
      sidebar.style.display = 'none'
    }, 300)
  }

  // Делаем глобально доступным для onclick в HTML
  window.toggleMenu = function () {
    const isOpen = sidebar.classList.contains('open')
    isOpen ? closeMenu() : openMenu()
  }

  // Клавиатура
  burger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.toggleMenu()
    }
  })

  // Закрываем по клику вне сайдбара (на десктопе)
  document.addEventListener('click', (e) => {
    const isOpen = sidebar.classList.contains('open')
    if (!isOpen) return
    const clickInsideSidebar = sidebar.contains(e.target)
    const clickOnBurger = burger.contains(e.target)
    if (!clickInsideSidebar && !clickOnBurger) closeMenu()
  })
})()
