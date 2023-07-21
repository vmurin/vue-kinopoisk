<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import LocalDB from '@/assets/LocalDB';
import MovieList from '@/components/MovieList.vue';
import { IconSearch } from '@tabler/icons-vue';

const apiKey = import.meta.env.VITE_API_KEY
const searchText = ref("")
const movies: Ref<MeiliMovieEntity[]> = ref([]);
const localDB = new LocalDB();

import {
  KinopoiskDev,
  MovieQueryBuilder,
  type MeiliMovieEntity
} from '@openmoviedb/kinopoiskdev_client';

const kp = new KinopoiskDev(`${import.meta.env.VITE_KINOPOISK_API_KEY}`);

onMounted(() => {
  const lastMovies = localDB.get('lastResults');
  if (lastMovies) {
    try {
      movies.value = JSON.parse(lastMovies);
    } catch (e) {
      console.error(`Error parsing: ${lastMovies}`);
    }
  }
});

async function searchKino() {
  localDB.set('search', searchText.value)
  console.log(`=> ${localDB.get('search')}`);
  const queryBuilder = new MovieQueryBuilder();
  // Создаем запрос для поиска фильмов по подходящих под наш запрос
  const query = queryBuilder
    // Указываем что хотим получить фильм под названием Аватар вышедший в 2022
    .query(localDB.get('search'))
    .select( ['id', 'name', 'rating', 'poster', 'year', 'movieLength', 'description', 'shortDescription'])
    // Добавляем пагинацию и получаем 1 страницу по с 10 фильмами на странице
    .paginate(1, 9)
    // Собираем запрос
    .build();

  const { data, error, message } = await kp.movie.getBySearchQuery(query);

  if (data) {
    const { docs, page, limit } = data;
    console.log(`Страница ${page} из ${limit}`);
    console.log(docs)
    movies.value = docs.filter(mov => mov.poster != null)
    localDB.set('lastResults', JSON.stringify(movies.value));
  }

  // Если будет ошибка, то выведем ее в консоль
  if (error) console.log(error, message);
};

</script>

<template>
  <div class="home">
    <div class="logo">
      <h2>KinoPoisk</h2>
      <img src="@/assets/kinopoisk.svg" />
    </div>
    
    <form class="search-bar" @submit.prevent="searchKino">
      <input type="text" placeholder="What are you looking for ?" v-model="searchText"/>
      <button type="submit">
        <IconSearch :size="36" />
      </button>
    </form>

    <MovieList :movies="movies" />
    
  </div>
</template>

<style lang="scss">
.home {
  // LOGO 
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    left: 42%;
    width: 250px;
    height: 250px;
    h2 {
      color: white;
      font-size: 60px;
      position: relative;
      top: 15px;
      right: 15px;
    }
    img {
      height: 4em;
    }
  }
  // SEARCH BAR 
  .search-bar {
    position: relative;
    left: 30%;
    width: 100%;
    margin-top: -20px;
    max-width: 700px;
    background: var(--search-bar-color);
    display: flex;
    align-items: center;
    border-radius: 60px;
    padding: 10px 20px;
    
    input {
      background: transparent;
      flex: 1;
      border: none;
      appearance: none;
      outline: none;
      padding: 24px 20px;
      font-size: 23px;
      color: var(--search-bar-text);
      &::placeholder {
        color: var(--search-bar-placeholder)
      }
    }
    button {
      border: none;
      outline: none;
      text-align: center;
      background: var(--search-icon-background);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      cursor: pointer;
    
      .search-icon {
        font-size: 25px;
        color: var(--search-bar-placeholder);
      }
    }
  }
}
</style>