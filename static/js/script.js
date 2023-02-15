var vagonsFile = [],
  vagons = {}

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
      checkTheVagons()
      document.querySelector('.lds-ring').style.visibility = 'hidden'
      document.querySelector('.lds-ring').style.height = '0px'
      switchButton()
    })
  // .then(() => {
  //   document.querySelector('.lds-ring').style.visibility = 'hidden'
  //   document.querySelector('.lds-ring').style.height = '0px'
  //   document.querySelector('.content').style.visibility = 'visible'
  // })
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

function checkTheVagons() {
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
                console.log(items[i], vagons[items[i]])
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

function isEmpty(str) {
  if (typeof str === 'undefined' || !str || str.length === 0 || str === '')
    return true
  else return false
}
