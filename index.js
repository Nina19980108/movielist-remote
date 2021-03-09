const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const icons = document.querySelector('#icons')

let filterMovies = []

const movies = []
axios.get(INDEX_URL)
  .then(response => {
    movies.push(...response.data.results)
    renderMovieList(getMoviesByPage(1))
    renderPaginator(movies.length)

  })
  .catch(error => { console.log(error) })


///////// event listener /////////////

dataPanel.addEventListener('click', event => {
  if (event.target.classList.contains('btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id))
  } else if (event.target.classList.contains('btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keywords = searchInput.value.trim().toLowerCase()

  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keywords))
  if (filterMovies.length === 0) {
    return alert(`There are no movies matching the keyword : ${keywords}`)
  }

  if (dataPanel.classList.contains('row')) {
    renderMovieList(getMoviesByPage(1))
  } else {
    renderMovieByList(getMoviesByPage(1))
  }
  renderPaginator(filterMovies.length)
})

paginator.addEventListener('click', function onClickPaginator(event) {
  if (event.target.tagName !== 'A') return

  const page = event.target.dataset.page
  if (dataPanel.classList.contains('row')) {
    renderMovieList(getMoviesByPage(page))
  } else {
    renderMovieByList(getMoviesByPage(page))
  }

})

icons.addEventListener('click', function onClickIcons(event) {
  if (event.target.tagName !== 'I') return

  if (event.target.classList.contains('cardBtn')) {
    dataPanel.classList.add('row')
    renderMovieList(getMoviesByPage(1))

  } else if (event.target.classList.contains('listBtn')) {
    dataPanel.classList.remove('row')
    renderMovieByList(getMoviesByPage(1))
  }
})
////////////// function //////////////

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-sm-6 col-md-4 col-lg-3 cardDiv">
        <div class="mb-2 cardDiv">
          <div class="card">
            <img
              src="${POSTER_URL}${item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">
                More
              </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function renderMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      modalTitle.innerHTML = `${data.title}`
      modalImage.innerHTML = `<img
                src="${POSTER_URL + data.image}"
                alt="movie-poster" class="img-fluid">`
      modalDescription.innerHTML = `${data.description}`
      modalDate.innerHTML = `release date: ${data.release_date}`
    })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert('This movie is in favorite list')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function renderPaginator(amount) {
  const pageLength = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= pageLength; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const startPage = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startPage, startPage + MOVIES_PER_PAGE)
}

function renderMovieByList(data) {

  let rawHTML = '<ul class="list-group list-group-flush">'
  data.forEach(item => {
    rawHTML += `<li class="list-group-item d-flex justify-content-between">
          <p class="mb-0 d-flex align-items-center">${item.title}</p>
          <div>
            <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
              data-id="${item.id}">
              More
            </button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </li>`
  })
  rawHTML += '</ul>'
  dataPanel.innerHTML = rawHTML
}
