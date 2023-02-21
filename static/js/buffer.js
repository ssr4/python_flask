import * as ex from './excel.js'
class customExcel extends ex.Excel {
  createTableBody(mas) {
    let table = document.querySelector('.tableBody')
    table.innerHTML += ('<tr>' + '<td></td>'.repeat(4) + '</tr>').repeat(
      mas.length
    )
    this.tableFill(mas)
  }

  tableFill(mas) {
    let tr = document.querySelectorAll('#tableVagons tr'),
      td
    for (let i = 0; i < tr.length; i++) {
      td = tr[i].querySelectorAll('td')
      td[0].textContent = i + 1
      td[1].textContent = mas[i]
      td[2].textContent = code
      td[3].textContent = subgr
    }
    document.querySelector('.tableAll').style.display = 'block'
    document.getElementById('countVag').style.visibility = 'visible'
    document.getElementById(
      'countVag'
    ).innerHTML = `Количество вагонов: ${mas.length}`
  }
}

const custom = new customExcel()
let code, subgr

document.addEventListener('DOMContentLoaded', () => {
  const area = document.querySelector('.area')
  document.getElementById('btnClick').addEventListener('click', () => {
    clearAll()
    inputForCodeAndName()
  })
  document.getElementById('btnClear').addEventListener('click', () => {
    clearAll()
    custom._vagons = {}
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
        if (!custom.isEmpty(document.getElementById('input1').value))
          code = document.getElementById('input1').value
        if (!custom.isEmpty(document.getElementById('input2').value))
          subgr = document.getElementById('input2').value
        if (!custom.isEmpty(code) && !custom.isEmpty(subgr)) {
          swal(
            'Отлично!',
            'Вы заполнили для вагонов поля имени и группы',
            'success'
          ).then(() => searchVagonsInText(area.value))
          // area.readOnly = true
        } else
          swal({
            title: 'Заполните поля для вставки в таблицу!',
            // возвращаемся обратно в функцию чтобы заполнить эти поля
          }).then(() => inputForCodeAndName())
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
  custom
    .getAllVagons()
    .then(() => {
      document.querySelector('.loader').style.visibility = 'hidden'
      document.querySelector('.loader').style.height = '0px'
      // проверяем вагоны из буффера с теми, которые в базе данных, переопределяя класс excel
      custom.getVagonSet(mas)
    })
    .then(() => {
      console.log(mas)
    })
}
