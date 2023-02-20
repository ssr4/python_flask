import * as ex from './excel.js'
const excel = new ex.Excel()
let code, subgr

document.addEventListener('DOMContentLoaded', () => {
  setDynamicResizeOfTextArea()
})

function setDynamicResizeOfTextArea() {
  // максимальная высота поля для ввода текста - 60 процентов от всей высоты экрана
  var maxWidth = 200
  var maxHeight = window.innerHeight * 0.2
  const area = document.querySelector('.area')
  area.addEventListener('input', () => {
    // Если высота больше максимальной
    if (area.clientHeight > maxHeight) return

    // Если появляется скролл и его ширина больше клиентской → увеличиваем ширину клиента
    if (area.scrollWidth > area.clientWidth)
      area.style.width = area.scrollWidth + 'px'

    // Если ширина больше максимально допустимой → даем словам "ломаться" и фиксируем ширину
    if (area.clientWidth >= maxWidth) {
      area.style.width = maxWidth
      area.style.whiteSpace = 'pre-wrap'
    }

    // Если появляется скролл и его высота клиентской → увеличиваем высоту клиента
    if (area.scrollHeight > area.clientHeight)
      area.style.height = area.scrollHeight + 'px'
    inputForCodeAndInput()
  })
}

function inputForCodeAndInput() {
  var form = document.createElement('div')
  const area = document.querySelector('.area')
  form.innerHTML = `
          <span style="font-size: 18px">Введите группу <b>(CODE)</b></span><br><br>
          <input id="input1" style="width:60%; font-size: 20px"><br><br>
          <span style="font-size: 18px">Введите имя <b>(SUBGR)</b></span><br><br>
          <input id="input2" style="width:60%; font-size: 20px">
          `
  swal({
    title: 'Заполните поля для вставки в таблицу',
    content: form,
    buttons: {
      cancel: 'Отмена',
      catch: {
        text: 'Добавить',
      },
    },
  }).then((value) => {
    switch (value) {
      case 'catch':
        if (!excel.isEmpty(document.getElementById('input1').value))
          code = document.getElementById('input1').value
        if (!excel.isEmpty(document.getElementById('input2').value))
          subgr = document.getElementById('input2').value
        if (!excel.isEmpty(code) && !excel.isEmpty(subgr)) {
          swal(
            'Отлично!',
            'Вы заполнили для вагонов поля имени и группы',
            'success'
          )
          area.readOnly = true
        } else
          swal('Необходимо заполнить поля!').then(() => inputForCodeAndInput())
        break
      default:
        swal(
          'Выход',
          'Вы вышли, необходимо заново ввести текст из буфера',
          'error'
        )
        area.value = ''
        break
    }
  })
}
