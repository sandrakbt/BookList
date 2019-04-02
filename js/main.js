(function(){
  // Functions
  const createBookItem = (title, description, cover) => {
    const newBook = $sampleBook.cloneNode(true)
    newBook.querySelector('#book-title').textContent = title
    newBook.querySelector('#book-description').textContent = description
    newBook.querySelector('#book-cover').src = cover
    newBook.querySelector('#book-cover').alt = 'Book cover: ' + title
    $listBox.appendChild(newBook)
  }
  const processApiJSON = books => {
    const infos = books.map(b => {
      const { title, description, imageLinks } = b.volumeInfo
      let cover = 'https://via.placeholder.com/128x192'
      if (imageLinks) {
        const images = Object.keys(imageLinks)
        if (imageLinks.thumbnail) {
          cover = imageLinks.thumbnail
        } else if (images.length > 0) {
          imageLinks(images[0])
        }
      }
      const words = description ? description.split(' ') : []
      return {
        title,
        description: words.length >= 15 ? words.slice(0, 15).join(' ') + '...' : description,
        cover
      }
    })
    infos.forEach(i => {
      createBookItem(i.title, i.description, i.cover)
    })
  }
  const loadBooks = (query = '', offset = 0, cb) => {
    if (isLoading) return
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${offset}`)
    .then(response => response.json())
    .then(json => {
      isLoading = false
      page += 1
      cb(json.items)
    })
    .catch(error => {
      alert('Loading error occurred')
    })
    isLoading = true
  }
  const onPageScroll = event => {
    const distanceFromBottom = Math.max(document.body.offsetHeight - (window.pageYOffset + window.innerHeight), 0)
    if (distanceFromBottom < minimalLoadingOffset) {
      loadBooks(currentQuery, page * booksPerPage, processApiJSON)
    }
  }
  const showElement = (element, value) => {
    element.classList.toggle('hidden', !value)
  }
  const processUrlChange = () => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('search')
    if (query) {
      showElement($searchBox, false)
      showElement($listBox, true)
      currentQuery = query
      window.addEventListener('scroll', onPageScroll)
      loadBooks(currentQuery, page * booksPerPage, processApiJSON)
    } else {
      showElement($searchBox, true)
      showElement($listBox, false)
      window.removeEventListener('scroll', onPageScroll)
    }
  }
  // Search box
  const $searchBox = document.querySelector('#search-box')
  const $searchInput = $searchBox.querySelector('#search-input')
  const $searchButton = $searchBox.querySelector('#search-button')
  // List box
  const $listBox = document.querySelector('#list-box')
  const $sampleBook = $listBox.querySelector('#sample-book')
  $listBox.removeChild($sampleBook)
  // Main
  let isLoading = false
  const booksPerPage = 10
  let page = 0
  let currentQuery = ''
  const minimalLoadingOffset = 600
  // Listeners binding
  $searchButton.addEventListener('click', () => {
    const query = $searchInput.value.trim().replace(/\s+/g, ' ')
    if (!query.length) return
    window.history.pushState(null, query, `?search=${query.replace(/ /g, '+')}`)
    processUrlChange()
  })
  window.addEventListener('popstate', processUrlChange)
  window.addEventListener('load', processUrlChange)
})()
