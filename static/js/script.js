function myFunction() {
  // confirm('are you sure? ')
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
    .then((myjson) => {
      console.log(myjson)
    })
}
