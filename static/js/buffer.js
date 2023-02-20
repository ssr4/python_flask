import * as excel from './excel.js'

document.addEventListener('DOMContentLoaded', () => {
  // максимальная высота поля для ввода текста - 60 процентов от всей высоты экрана
  var maxWidth = 200
  var maxHeight = window.innerHeight * 0.6
  const area = document.querySelector('.area')
  area.addEventListener('input', () => {
    // Если появляется скролл и его ширина больше клиентской → увеличиваем ширину клиента
    if (area.scrollWidth > area.clientWidth)
      area.style.width = area.scrollWidth + 'px'

    // Если ширина больше максимально допустимой → даем словам "ломаться" и фиксируем ширину
    if (area.clientWidth >= maxWidth) {
      area.style.width = maxWidth
      area.style.whiteSpace = 'pre-wrap'
    }

    // Если высота больше максимальной
    if (area.clientHeight > maxHeight) return

    // Если появляется скролл и его высота клиентской → увеличиваем высоту клиента
    if (area.scrollHeight > area.clientHeight)
      area.style.height = area.scrollHeight + 'px'
  })
})
