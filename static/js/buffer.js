import * as ex from './excel.js'
const excel = new ex.Excel()
let code, subgr

document.addEventListener('DOMContentLoaded', () => {
  const area = document.querySelector('.area')
  setDynamicResizeOfTextArea()
  document.getElementById('btnClick').addEventListener('click', () => {
    document.querySelector('.loader').style.visibility = 'visible'
    clearAll()
    searchVagonsInText(area.value)
  })
  document.getElementById('btnClear').addEventListener('click', () => {
    excel._vagons = {}
    area.value = []
    clearAll()
  })
})

function clearAll() {
  document.querySelector('.tableAll').style.display = 'none'
  document.querySelector('.tableBody').innerHTML = ''
  document.getElementById('countVag').style.visibility = 'hidden'
  document.getElementById('countVag').innerHTML = 'Количество вагонов: '
}

function setDynamicResizeOfTextArea() {
  // максимальная высота поля для ввода текста - 60 процентов от всей высоты экрана
  var maxWidth = 200
  var maxHeight = window.innerHeight * 0.2
  const area = document.querySelector('.area')
  area.addEventListener('input', () => {
    // Если высота больше максимальной
    // if (area.clientHeight > maxHeight) return
    // // Если появляется скролл и его ширина больше клиентской → увеличиваем ширину клиента
    // if (area.scrollWidth > area.clientWidth)
    //   area.style.width = area.scrollWidth + 'px'
    // // Если ширина больше максимально допустимой → даем словам "ломаться" и фиксируем ширину
    // if (area.clientWidth >= maxWidth) {
    //   area.style.width = maxWidth
    //   area.style.whiteSpace = 'pre-wrap'
    // }
    // // Если появляется скролл и его высота клиентской → увеличиваем высоту клиента
    // if (area.scrollHeight > area.clientHeight)
    //   area.style.height = area.scrollHeight + 'px'
    // inputForCodeAndName()
  })
}

function inputForCodeAndName() {
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
          searchVagonsInText(area.value)
        } else
          swal({
            title: 'Заполните поля для вставки в таблицу!',
            // возвращаемся обратно в функцию чтобы заполнить эти поля
          }).then(() => inputForCodeAndInput())
        break
      default:
        swal(
          'Выход',
          'Вы вышли, необходимо заново ввести текст из буфера',
          'error'
        )
        area.value = ''
        area.style.height = '100%'
        break
    }
  })
}

// функция поиска номера вагонов в тексте
function searchVagonsInText(text) {
  let str = '',
    mas = []
  for (let char of text) {
    if (!/\D/.test(char)) {
      // проверка нужна чтобы проверить что номер вагона не начинается с 0 и 1
      if (!str.length) {
        if (char != '0' && char != '1') {
          str += char
        }
      } else str += char
    }
    if (str.length === 8) {
      mas.push(str)
      str = ''
    }
  }

  excel.getAllVagons().then(() => {
    document.querySelector('.loader').style.visibility = 'hidden'
    document.querySelector('.loader').style.height = '0px'
    excel.getVagonSet(mas)
  })
  // excel.getVagonSet(mas)
}
