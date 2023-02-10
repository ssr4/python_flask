function myFunction() {
  if (
    document.querySelector('.text_field').getAttribute('style') ===
    'visibility: hidden'
  ) {
    document
      .querySelector('.text_field')
      .setAttribute('style', 'visibility: visible')
    document.querySelector('.btn').innerHTML = 'Скрыть файл'
  } else {
    document
      .querySelector('.text_field')
      .setAttribute('style', 'visibility: hidden')
    document.querySelector('.btn').innerHTML = 'Посмотреть файл'
  }

  fetch('/vagons_from_file')
    .then((response) => {
      return response.json()
    })
    .then((content) => {
      let count = 0
      content.forEach((vagon) => {
        // проверка что в строке исключительно числа
        if (!/\D/.test(vagon)) {
          if (vagon.length === 8) count++
        }
      })
      console.log('количество вагонов ', count)
    })
}

// const isNumeric = (n) => !!Number(n)
// // Возвращаем 0 если строка не содержит цифр.
// const ExistNum = (n) => n.replace(/\D/g, '') || 0
