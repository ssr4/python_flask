export class Excel {
  constructor() {
    this.vagons = {}
    this.vagonsFile = []
  }

  get vagons() {
    return this._vagons
  }

  set vagons(mas) {
    this._vagons = mas
  }

  test() {
    alert('here')
  }

  // функция проверки строки на пустоту
  isEmpty(str) {
    if (typeof str === 'undefined' || !str || str.length === 0 || str === '')
      return true
    else return false
  }
}

var vagonsFile = [],
  vagons = {}

document.addEventListener('DOMContentLoaded', () => {
  const file = document.querySelector('#myFile'),
    list = document.querySelector('#vagonList')
  if (!isEmpty(file)) file.addEventListener('change', () => inputFile())
  if (!isEmpty(list)) list.addEventListener('click', () => checkList())
})

// функция загрузки файла
function inputFile() {
  const form = document.getElementById('formFile')
  form.submit()
}

// функция получения всех вагонов чтобы потом сравнивать на совпадение
function getAllVagons() {
  let i = 0
  fetch('/get_all_vagons')
    .then((response) => {
      return response.json()
    })
    .then((items) => {
      items.forEach((item) => {
        vagons[item[0]] = ++i
      })
    })
    .then(() => {
      getVagonsFromFile()
      document.querySelector('.loader').style.visibility = 'hidden'
      document.querySelector('.loader').style.height = '0px'
      switchButton()
    })
}

// функция проверки получения списка вагонов из БД, если не получены то открывается загрузчик
function checkList() {
  if (isEmpty(Object.keys(vagons).length)) {
    document.querySelector('.loader').style.visibility = 'visible'
    getAllVagons()
  } else if (switchButton()) return
}

// функция кнопки проверки вагонов
function switchButton() {
  let style = document.querySelector('.tableAll').getAttribute('style')
  if (style === 'display: none;' || isEmpty(style)) {
    // проверка нужна, чтоб раньше времени не открывать таблицу
    if (!isEmpty(style)) {
      document.querySelector('.tableAll').style.display = 'block'
      document.getElementById('countVag').style.visibility = 'visible'
    }
    document.querySelector('#vagonList').innerHTML = 'Скрыть таблицу вагонов'
    return false
  } else {
    document.querySelector('.tableAll').style.display = 'none'
    document.getElementById('countVag').style.visibility = 'hidden'
    document.querySelector('#vagonList').innerHTML = 'Показать таблицу вагонов'
    return true
  }
}

// функция получения вагонов из файла
function getVagonsFromFile() {
  if (isEmpty(vagonsFile)) {
    fetch('/vagons_from_file')
      .then((response) => {
        return response.json()
      })
      .then((items) => {
        vagonsFile = items
        getVagonSet(items)
      })
  }
}

// асинхронный вызов функции
async function getVagonSet(items) {
  let generator = checkVagons(0, items)
  for await (let value of generator) createTableBody(value)
}

// функция проверки вагонов из файла, сравнивая с имеющимися вагонами в БД
async function* checkVagons(start, items) {
  let end = items.length,
    mas = [],
    masExist = {}
  for (let i = start; i < end; i++) {
    await new Promise((resolve) => {
      // проверка на то, что в номере вагона все цифры
      if (!/\D/.test(items[i])) {
        // проверка на то, что в номере вагона 8 цифр
        if (items[i].length === 8) {
          // проверка на то, есть ли в базе еще такие же номера вагонов при добавлении
          if (!isEmpty(vagons[items[i]]) && isEmpty(masExist[items[i]])) {
            alertMessage(
              `Вагон с номером ${items[i]} уже имеется в базе данных, выберите оставлять запись или добавлять новую`,
              'Старая запись',
              'Новая запись'
            ).then((value) => {
              switch (value) {
                case 'skip':
                  swal('Меняем!', 'Добавлен новая запись', 'success').then(
                    () => {
                      setVagon(mas, masExist, items[i])
                      resolve()
                    }
                  )
                  break
                default:
                  swal(
                    'Оставляем!',
                    'Вы оставили запись без изменений',
                    'success'
                  ).then(() => resolve())
                  break
              }
            })
          } else {
            setVagon(mas, masExist, items[i])
            resolve()
          }
        } else if (items[i].length > 8) {
          alertMessage(
            `Номер вагона ${items[i]} превышает 8 цифр`,
            'Обрезать',
            'Пропустить'
          ).then((value) => {
            switch (value) {
              case 'skip':
                resolve()
                break
              default:
                swal(`Номер вагона обрезан - ${items[i].substr(0, 8)}`).then(
                  () => {
                    setVagon(mas, masExist, items[i].substr(0, 8))
                    resolve()
                  }
                )
                break
            }
          })
        } else
          alertMessage(
            `Номер вагона ${items[i]} меньше 8 цифр. Продолжить?`,
            'Выйти',
            'Пропустить'
          ).then((value) => {
            switch (value) {
              case 'skip':
                resolve()
                break
              default:
                swal(
                  'Выход',
                  'Вы вышли, необходимо заново загрузить файл',
                  'error'
                )
                break
            }
          })
      } else {
        alertMessage(
          `Это не номер вагона ${items[i]}. Продолжить?`,
          'Выйти',
          'Пропустить'
        ).then((value) => {
          switch (value) {
            case 'skip':
              resolve()
              break
            default:
              swal(
                'Выход',
                'Вы вышли, необходимо заново загрузить файл',
                'error'
              )
              break
          }
        })
      }
    })
  }
  yield mas
}

// функция проверки вагона что он уже существует
function setVagon(mas1, mas2, n) {
  if (isEmpty(mas2[n])) {
    mas1.push(n)
    mas2[n] = n
  }
}

// функция вызова предупреждающего окна
function alertMessage(text, btn1, btn2) {
  return swal(text, {
    icon: 'warning',
    buttons: {
      cancel: btn1,
      catch: {
        text: btn2,
        value: 'skip',
      },
    },
  })
}

// функция проверки строки на пустоту
function isEmpty(str) {
  if (typeof str === 'undefined' || !str || str.length === 0 || str === '')
    return true
  else return false
}

function createTableBody(mas) {
  let table = document.querySelector('.tableBody')
  table.innerHTML += ('<tr>' + '<td></td>'.repeat(2) + '</tr>').repeat(
    mas.length
  )
  tableFill(mas)
}

function tableFill(mas) {
  let tr = document.querySelectorAll('#tableVagons tr'),
    td
  for (let i = 0; i < tr.length; i++) {
    td = tr[i].querySelectorAll('td')
    td[0].textContent = i + 1
    td[1].textContent = mas[i]
  }
  document.querySelector('.tableAll').style.display = 'block'
  document.getElementById('countVag').style.visibility = 'visible'
  document.getElementById('countVag').innerHTML += mas.length
}
