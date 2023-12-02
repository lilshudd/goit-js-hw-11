import Notiflix from 'notiflix';
import axios from 'axios';

const searchForm = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  currentPage = 1;

  try {
    const apiKey = '41033555-9b6fb45ac4949266ed2166a1c';
    const searchQuery = searchForm.elements.searchQuery.value;

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    const images = response.data.hits;

    if (images.length === 0) {
      Notiflix.Notify.Info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    } else {
      gallery.innerHTML = '';

      images.forEach(image => {
        const photoCard = createPhotoCard(image);
        gallery.appendChild(photoCard);
      });

      loadMoreBtn.style.display = 'block';

      const totalHits = response.data.totalHits;
      if (images.length >= totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.Info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.Failure('Error fetching images. Please try again.');
  }
});

loadMoreBtn.addEventListener('click', async function () {
  currentPage++;

  try {
    const apiKey = '41033555-9b6fb45ac4949266ed2166a1c';
    const searchQuery = searchForm.elements.searchQuery.value;

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: 40,
      },
    });

    const newImages = response.data.hits;

    newImages.forEach(image => {
      const photoCard = createPhotoCard(image);
      gallery.appendChild(photoCard);
    });

    const totalHits = response.data.totalHits;
    if (gallery.children.length >= totalHits) {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.Info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    Notiflix.Notify.Failure('Error fetching more images. Please try again.');
  }
});

function createPhotoCard(image) {
  const photoCard = document.createElement('div');
  photoCard.classList.add('photo-card');

  const imgElement = document.createElement('img');
  imgElement.src = image.webformatURL;
  imgElement.alt = image.tags;
  imgElement.loading = 'lazy';

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('info');

  const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];

  infoItems.forEach(item => {
    const infoItem = document.createElement('p');
    infoItem.classList.add('info-item');
    infoItem.innerHTML = `<b>${item}</b>: ${image[item.toLowerCase()]}`;
    infoContainer.appendChild(infoItem);
  });

  photoCard.appendChild(imgElement);
  photoCard.appendChild(infoContainer);

  return photoCard;
}
