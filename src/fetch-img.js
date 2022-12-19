import axios from 'axios';

const KEY = '32048668-e2fb2d2180cb5d2e63ce535ce';

export async function getImages(query, page, perPage) {
  try {
    const config = {
      responseType: 'json',
      baseURL: 'https://pixabay.com/api',
    };

    const response = await axios.get(
      `/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
      config
    );

    return response;
  } catch (error) {
    return console.log(error);
  }
}
