// import swal from 'sweetalert'
// import swal from 'sweetalert'

var vagonsFile = [],
  vagons = {}

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
      document.querySelector('.lds-ring').style.visibility = 'hidden'
      document.querySelector('.lds-ring').style.height = '0px'
      switchButton()
    })
}

// функция проверки получения списка вагонов из БД, если не получены то открывается загрузчик
function checkList() {
  if (isEmpty(Object.keys(vagons).length)) {
    document.querySelector('.lds-ring').style.visibility = 'visible'
    getAllVagons()
  } else if (switchButton()) return
}

// функция кнопки проверки вагонов
function switchButton() {
  if (
    document.querySelector('.textField').getAttribute('style') ===
    'visibility: hidden'
  ) {
    document
      .querySelector('.textField')
      .setAttribute('style', 'visibility: visible')
    document.querySelector('#vagonList').innerHTML = 'Скрыть список вагонов'
    return false
  } else {
    document
      .querySelector('.textField')
      .setAttribute('style', 'visibility: hidden')
    document.querySelector('#vagonList').innerHTML = 'Показать список вагонов'
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
  for await (let value of generator) {
  }
}

// функция проверки вагонов из файла, сравнивая с имеющимися вагонами в БД
async function* checkVagons(start, items) {
  let end = items.length,
    count = 0,
    i = 0,
    mas = []
  for (let i = start; i < end; i++) {
    // ура, можно использовать await!
    await new Promise((resolve) => {
      if (!/\D/.test(items[i])) {
        // проверка на то, что в номере вагона 8 цифр
        if (items[i].length === 8) {
          // проверка на то, есть ли в базе еще такие же номера вагонов при добавлении
          if (!isEmpty(vagons[items[i]])) {
            alertMessage(
              `Вагон с номером ${items[i]} уже имеется в базе данных, выберите оставлять запись или добавлять новую`,
              'Старая запись',
              'Новая запись'
            ).then((value) => {
              switch (value) {
                case 'skip':
                  swal('Меняем!', 'Добавлен новая запись', 'success').then(
                    () => {
                      textArea.value += `\t${items[i]}\n`
                      mas.push(items[i])
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
            textArea.value += `\t${items[i]}\n`
            mas.push(items[i])
            resolve()
          }
          count++
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
                    textArea.value += `\t${items[i].substr(0, 8)}\n`
                    mas.push(items[i].substr(0, 8))
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
              break
          }
        })
      }
    })
  }
  // console.log(mas)
  yield i
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
