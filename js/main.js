(function(){
  // Functions
  const createBookItem = (title, desc, img) => {
    
  }
  const loadBooks = (query) => {

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
    } else {
      showElement($searchBox, true)
      showElement($listBox, false)
    }
  }
  // Search box
  const $searchBox = document.querySelector('#search-box')
  const $searchInput = $searchBox.querySelector('#search-input')
  const $searchButton = $searchBox.querySelector('#search-button')
  // List box
  const $listBox = document.querySelector('#list-box')
  const $sampleBook = $listBox.querySelector('#sample-book')
  $searchButton.addEventListener('click', () => {
    const query = $searchInput.value.trim().replace(/\s+/g, ' ')
    if (!query.length) return
    window.history.pushState(null, query, `?search=${query.replace(/ /g, '+')}`)
    processUrlChange()
  })
  window.addEventListener('popstate', processUrlChange)
  window.addEventListener('load', processUrlChange)
})()
