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

function checkList() {
  if (isEmpty(Object.keys(vagons).length)) {
    document.querySelector('.lds-ring').style.visibility = 'visible'
    getAllVagons()
  } else if (switchButton()) return
}

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

function getVagonsFromFile() {
  const textArea = document.querySelector('#textArea')
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

async function getVagonSet(items) {
  let generator = checkVagons(0, items)
  for await (let value of generator) {
  }
}

async function* checkVagons(start, items) {
  let end = items.length,
    count = 0,
    i = 0
  for (let i = start; i < end; i++) {
    // ура, можно использовать await!
    await new Promise((resolve) => {
      if (!/\D/.test(items[i])) {
        // проверка на то, что в номере вагона 8 цифр
        if (items[i].length === 8) {
          // проверка на то, есть ли в базе еще такие же номера вагонов при добавлении
          if (!isEmpty(vagons[items[i]])) {
            swal(
              `Вагон с номером ${items[i]} уже имеется в базе данных, выберите оставлять запись или добавлять новую`,
              {
                icon: 'warning',
                buttons: {
                  cancel: 'Старая запись',
                  catch: {
                    text: 'Новая запись',
                    value: 'change',
                  },
                },
              }
            ).then((value) => {
              switch (value) {
                case 'change':
                  swal('Меняем!', 'Добавлен новая запись', 'success').then(
                    () => {
                      textArea.value += `\t${items[i]}\n`
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
            resolve()
          }
          count++
        } else if (items[i].length > 8) {
          console.log('here')
          swal(`Номер вагона ${items[i]} превышает 8 цифр`, {
            icon: 'warning',
            buttons: {
              cancel: 'Обрезать',
              catch: {
                text: 'Продолжить',
                value: 'change',
              },
            },
          }).then((value) => {
            switch (value) {
              case 'change':
                resolve()
                break
              default:
                swal(`Номер вагона обрезан - ${items[i].substr(0, 8)}`).then(
                  () => {
                    textArea.value += `\t${items[i].substr(0, 8)}\n`
                    resolve()
                  }
                )
                break
            }
          })
        } else
          swal(`Номер вагона ${items[i]} меньше 8 цифр. Продолжить?`, {
            icon: 'warning',
            buttons: {
              cancel: 'Выйти',
              catch: {
                text: 'Продолжить',
                value: 'skip',
              },
            },
          }).then((value) => {
            switch (value) {
              case 'skip':
                resolve()
                break
              default:
                break
            }
          })
      } else {
        swal(`Это не номер вагона ${items[i]}. Продолжить?`, {
          icon: 'warning',
          buttons: {
            cancel: 'Выйти',
            catch: {
              text: 'Пропустить',
              value: 'skip',
            },
          },
        }).then((value) => {
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
  yield i
}

function isEmpty(str) {
  if (typeof str === 'undefined' || !str || str.length === 0 || str === '')
    return true
  else return false
}
