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
    .then((vagons) => {
      let count = 0
      let i = 0,
        answer = true
      do {
        i++
        if (!/\D/.test(vagons[i])) {
          if (vagons[i].length === 8) count++
          else if (!confirm(`Номер вагона ${vagons[i]} не 8 цифр. Продолжить?`))
            answer = false
        } else {
          if (!confirm(`Это не номер вагона ${vagons[i]}. Продолжить?`))
            answer = false
        }
      } while (answer && i < vagons.length)
      console.log('количество вагонов ', count)
    })
}
