var vagonsFile = [],
  vagons = []

getAllVagons()

// функция получения всех вагонов чтобы потом сравнивать на совпадение
function getAllVagons() {
  fetch('/get_all_vagons')
    .then((response) => {
      return response.json()
    })
    .then((items) => {
      console.log(items)
    })
}

function myFunction() {
  const textArea = document.querySelector('#textArea')
  let flag = switchButton()

  if (flag) {
    // textArea.value = '\tСписок вагонов:\n'
    return
  }

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
          i++
          if (!/\D/.test(items[i])) {
            if (items[i].length === 8) {
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
        } while (answer && i < items.length)
        textArea.value += `Количество вагонов \n  для добавления: ${count}`
      })
  }
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

function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false
  }
  return true
}
