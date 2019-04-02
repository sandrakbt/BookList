(function(){
  // Functions
  const createBookItem = (title, description, cover) => {
    const newBook = $sampleBook.cloneNode(true)
    newBook.removeAttribute('id')
    newBook.querySelector('#book-title').textContent = title
    newBook.querySelector('#book-description').textContent = description
    newBook.querySelector('#book-cover').src = cover
    newBook.querySelector('#book-cover').alt = 'Book cover: ' + title
    $listBox.appendChild(newBook)
  }
  const resetBookList = () => {
    while ($listBox.firstChild) {
      $listBox.removeChild($listBox.firstChild)
    }
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
    const percent = distanceFromBottom / document.body.offsetHeight
    if (percent < minimalLoadingOffset) {
      loadBooks(currentQuery, page * booksPerPage, processApiJSON)
    }
  }
  const showElement = (element, value) => {
    element.classList.toggle('hidden', !value)
  }
  const processUrlChange = () => {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('search')
    resetBookList()
    if (query) {
      showElement($searchView, false)
      showElement($listView, true)
      currentQuery = query
      window.addEventListener('scroll', onPageScroll)
      loadBooks(currentQuery, page * booksPerPage, processApiJSON)
    } else {
      showElement($searchView, true)
      showElement($listView, false)
      window.removeEventListener('scroll', onPageScroll)
    }
  }
  // Search view
  const $searchView = document.querySelector('#search-view')
  const $searchInput = $searchView.querySelector('#search-input')
  const $searchButton = $searchView.querySelector('#search-button')
  // List view
  const $listView = document.querySelector('#list-view')
  const $goBackButton = $listView.querySelector('#goback-button')
  const $listBox = $listView.querySelector('#list-box')
  const $sampleBook = $listBox.querySelector('#sample-book')
  // Main
  let isLoading = false
  const booksPerPage = 10
  let page = 0
  let currentQuery = ''
  const minimalLoadingOffset = 0.25
  // Listeners binding
  $goBackButton.addEventListener('click', () => {
    window.history.pushState(null, 'Google Search', window.location.href.split('?')[0])
    processUrlChange()
  })
  $searchButton.addEventListener('click', () => {
    const query = $searchInput.value.trim().replace(/\s+/g, ' ')
    if (!query.length) return
    window.history.pushState(null, query, `?search=${query.replace(/ /g, '+')}`)
    processUrlChange()
  })
  window.addEventListener('popstate', processUrlChange)
  window.addEventListener('load', processUrlChange)
})()
