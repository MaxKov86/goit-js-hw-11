import { getImages } from './fetch-img';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector(`#search-form`),
  searchFormInput: document.querySelector(`input`),
  submitBtn: document.querySelector(`button[type="submit"]`),
  imgGallery: document.querySelector(`.gallery`),
  loadMoreBtn: document.querySelector(`.load-more`),
};

let query = '';
let page = 1;
let perPage = 40;

refs.searchForm.addEventListener(`submit`, onSearch);
refs.loadMoreBtn.addEventListener(`click`, onLoadMoreClick);

function onSearch(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  refs.imgGallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  if (query === '') {
    return Notify.failure('Sorry, but input field is empty!');
  }

  getImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits > perPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }

      if (data.totalHits === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);

        return Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error =>
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      )
    );
}

function onLoadMoreClick() {
  page += 1;

  getImages(query, page, perPage)
    .then(({ data }) => {
      const totalPages = Math.ceil(data.totalHits / perPage);

      renderGallery(data.hits);

      if (page > totalPages) {
        refs.loadMoreBtn.classList.add('is-hidden');
        return Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error =>
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      )
    );
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <div class="photo-card">
  <a class="photo-card__link" href="${largeImageURL}" ><img src="${webformatURL}" alt="${tags}" loading="lazy" width=320 height=210/> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
 
</div>
        `;
    })
    .join('');

  refs.imgGallery.insertAdjacentHTML('beforeend', markup);
}
