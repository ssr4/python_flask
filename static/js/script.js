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
      test()
      document.querySelector('.lds-ring').style.visibility = 'hidden'
      document.querySelector('.lds-ring').style.height = '0px'
      switchButton()
    })
}

function myFunction() {
  // если кнопка скрыть результаты то мы выходим из функции
  // if (switchButton()) return
  // если у нас вагоны не получены то мы их получаем
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

async function checkTheVagons() {
  const textArea = document.querySelector('#textArea')
  if (isEmpty(vagonsFile)) {
    fetch('/vagons_from_file')
      .then((response) => {
        return response.json()
      })
      .then((items) => {
        let count = 0
        let i = 0,
          answer = true
        vagonsFile = items
        do {
          // проверка на то, есть ли символы отличные от цифр
          if (!/\D/.test(items[i])) {
            // проверка на то, что в номере вагона 8 цифр
            if (items[i].length === 8) {
              // проверка на то, есть ли в базе еще такие же номера вагонов при добавлении
              if (!isEmpty(vagons[items[i]])) {
                // answer = false
                // swal({
                //   title: 'Are you sure?',
                //   text: 'Once deleted, you will not be able to recover this imaginary file!',
                //   icon: 'warning',
                //   buttons: true,
                //   dangerMode: true,
                // })
                //   .then((willDelete) => {
                //     if (willDelete) {
                //       swal('Poof! Your imaginary file has been deleted!', {
                //         icon: 'success',
                //       })
                //     } else {
                //       return
                //     }
                //   })
                //   .then(() => {
                //     alert('here')
                //   })
              }
              count++
              textArea.value += `\t${items[i]}\n`
            } else if (
              !confirm(`Номер вагона ${items[i]} не 8 цифр. Продолжить?`)
            )
              answer = false
          } else {
            if (!confirm(`Это не номер вагона ${items[i]}. Продолжить?`))
              answer = false
          }
        } while (answer && i++ < items.length - 1)
        textArea.value += `Количество вагонов \n  для добавления: ${count}`
      })
  }
}

function test() {
  const textArea = document.querySelector('#textArea')
  if (isEmpty(vagonsFile)) {
    fetch('/vagons_from_file')
      .then((response) => {
        return response.json()
      })
      .then((items) => {
        vagonsFile = items
        test2(items)
      })
  }
}

async function test2(items) {
  let generator = generateSequence(0, items)
  for await (let value of generator) {
  }
}

async function* generateSequence(start, items) {
  let end = items.length,
    count = 0,
    i = 0,
    answer = true
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
                text: 'Пропустить',
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
        } else if (!confirm(`Номер вагона ${items[i]} не 8 цифр. Продолжить?`))
          return
        else resolve()
      } else {
        if (!confirm(`Это не номер вагона ${items[i]}. Продолжить?`)) return
        else resolve()
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
