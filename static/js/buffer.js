import * as ex from './excel.js'
const excel = new ex.Excel()
let code, subgr

document.addEventListener('DOMContentLoaded', () => {
  const area = document.querySelector('.area')
  document.getElementById('btnClick').addEventListener('click', () => {
    clearAll()
    inputForCodeAndName()
  })
  document.getElementById('btnClear').addEventListener('click', () => {
    clearAll()
    excel._vagons = {}
    area.value = []
  })
})

function clearAll() {
  document.querySelector('.tableAll').style.display = 'none'
  document.querySelector('.tableBody').innerHTML = ''
  document.getElementById('countVag').style.visibility = 'hidden'
  document.getElementById('countVag').innerHTML = 'Количество вагонов: '
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
          // area.readOnly = true
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
  document.querySelector('.loader').style.visibility = 'visible'
  // получаем список вагонов из базы данных
  excel.getAllVagons().then(() => {
    document.querySelector('.loader').style.visibility = 'hidden'
    document.querySelector('.loader').style.height = '0px'
    // проверяем вагоны из буффера с теми, которые в базе данныз
    excel.getVagonSet(mas)
  })
}
