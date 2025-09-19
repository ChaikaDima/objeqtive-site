const photos = document.querySelectorAll(
  '.grid .grid-item img, .grid img, .item'
)
const lightbox = document.querySelector('.lightbox')
const lightboxImg = document.querySelector('.lightbox-img')
const closeBtn = document.querySelector('.close')
const navLeft = document.querySelector('.navbtn.left')
const navRight = document.querySelector('.navbtn.right')
let currentIndex = 0
let currentSet = []
let zoomed = false

const openLightbox = (index) => {
  currentIndex = index
  currentSet = Array.from(document.querySelectorAll('.item')).filter(
    (p) => p.style.display !== 'none'
  )

  const full = currentSet[currentIndex].dataset.full

  lightboxImg.src = full
  resetZoom()
  lightbox.classList.remove('hidden')
}

photos.forEach((photo, i) => {
  photo.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      // на мобильных ничего не делаем
      e.preventDefault()
      return
    }
    openLightbox(i)
  })
})

const closeLightbox = () => {
  lightbox.classList.add('hidden')
  resetZoom()
}
if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox)
}

lightbox.addEventListener('click', (e) => {
  // Блокируем закрытие, если кликаем по изображению или если был drag
  if (
    e.target !== lightbox ||
    isDragging // если мы двигали — не закрывать
  ) {
    return
  }

  closeLightbox()
})

navLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length
  updateImage()
})

navRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % currentSet.length
  updateImage()
})

const updateImage = () => {
  lightboxImg.classList.add('fade')
  setTimeout(() => {
    lightboxImg.src = currentSet[currentIndex].dataset.full
    resetZoom()
    lightboxImg.classList.remove('fade')
  }, 100)
}

const resetZoom = () => {
  zoomed = false
  lightboxImg.style.transform = 'scale(1)'
  lightboxImg.style.transformOrigin = `${originX}% ${originY}%` // ключевая строка!
  lightboxImg.classList.remove('zoomed')
}

lightboxImg.addEventListener('click', (e) => {
  if (dragged) {
    dragged = false
    return
  }

  if (!zoomed) {
    const rect = lightboxImg.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    originX = (offsetX / rect.width) * 100
    originY = (offsetY / rect.height) * 100
    lightboxImg.style.transformOrigin = `${originX}% ${originY}%`
    lightboxImg.style.transform = 'scale(3)'
    zoomed = true
    lightboxImg.classList.add('zoomed')
  } else {
    resetZoom()
  }
})

document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('hidden')) return
  if (e.key === 'ArrowRight') navRight.click()
  if (e.key === 'ArrowLeft') navLeft.click()
  if (e.key === 'Escape') closeLightbox()
})
let isDragging = false
let dragged = false
let startX, startY
let originX = 50,
  originY = 50

lightboxImg.addEventListener('mousedown', (e) => {
  if (!zoomed) return
  isDragging = true
  dragged = false
  startX = e.clientX
  startY = e.clientY
  e.preventDefault()
})

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !zoomed) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    dragged = true
  }

  originX -= (dx / lightboxImg.offsetWidth) * 100
  originY -= (dy / lightboxImg.offsetHeight) * 100

  originX = Math.max(0, Math.min(100, originX))
  originY = Math.max(0, Math.min(100, originY))

  lightboxImg.style.transformOrigin = `${originX}% ${originY}%`

  startX = e.clientX
  startY = e.clientY
})

document.addEventListener('mouseup', () => {
  isDragging = false
})

lightbox.addEventListener('click', (e) => {
  // Закрываем только если клик по фону И не было перетаскивания
  if (e.target === lightbox && !dragged) {
    closeLightbox()
  }
})
// Запрет правого клика по lightbox-картинке
lightboxImg.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// Запрет правого клика по миниатюрам галереи
document.querySelectorAll('.item').forEach((img) => {
  img.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
})
