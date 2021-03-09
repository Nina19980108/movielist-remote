const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')

const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

axios.get(INDEX_URL)
  .then(response => {
    renderMovieList(getMoviesByPage(1))
    renderPaginator(favoriteMovies.length)
  })
  .catch(error => { console.log(error) })

dataPanel.addEventListener('click', event => {
  if (event.target.classList.contains('btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id))
  } else if (event.target.classList.contains('btn-remove-movie')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onClickPaginator(event) {
  if (event.target.tagName !== 'A') return

  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))
})

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
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
              <button class="btn btn-danger btn-remove-movie" data-id="${item.id}">x</button>
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

function removeFromFavorite(id) {
  if (!favoriteMovies) { return }

  const index = favoriteMovies.findIndex(movie => movie.id === id)
  if (index === -1) { return }

  let page = Math.ceil((index + 1) / MOVIES_PER_PAGE)
  favoriteMovies.splice(index, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies))
  renderMovieList(getMoviesByPage(page))
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
  const data = favoriteMovies
  const startPage = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startPage, startPage + MOVIES_PER_PAGE)
}