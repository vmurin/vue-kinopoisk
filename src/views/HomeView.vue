<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import LocalDB from '@/assets/LocalDB';
import MovieList from '@/components/MovieList.vue';
import { IconSearch } from '@tabler/icons-vue';


import {
  KinopoiskDev,
  MovieQueryBuilder,
  type MeiliMovieEntity
} from '@openmoviedb/kinopoiskdev_client';
import { useUrlSearchParams } from '@vueuse/core'

const searchText = ref("")
const movies: Ref<MeiliMovieEntity[]> = ref([]);
const localDB = new LocalDB();
const params = useUrlSearchParams('history')

const kp = new KinopoiskDev(`${import.meta.env.VITE_KINOPOISK_API_KEY}`);

onMounted(() => {
  if (params.query) {
    searchText.value = params.query as string;
    searchKino()
  }
});

async function searchKino() {
  params.query = searchText.value;
  if (searchText.value == localDB.get('lastSearch')) {
    const lastMovies = localDB.get('lastResults');
    try {
      movies.value = JSON.parse(lastMovies);
      return;
    } catch (error) {
      console.log(error);
    }
  }
  localDB.set('search', searchText.value)
  const queryBuilder = new MovieQueryBuilder();
  // Создаем запрос для поиска фильмов по подходящих под наш запрос
  const query = queryBuilder
    // Указываем что хотим получить фильм под названием Аватар вышедший в 2022
    .query(localDB.get('search'))
    .select( ['id', 'name', 'rating', 'poster', 'year', 'movieLength', 'description', 'shortDescription'])
    .paginate(1, 9)
    .build();

  const { data, error, message } = await kp.movie.getBySearchQuery(query);

  if (data) {
    const { docs, page, limit } = data;
    movies.value = docs.filter(mov => mov.poster != null)
    localDB.set('lastResults', JSON.stringify(movies.value));
    localDB.set('lastSearch', searchText.value);
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
        color: var(--search-bar-placeholder);
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

  @media (max-width: 768px) {
    .logo {
      left: 0;
      margin: 0 auto;
      h2 {
        font-size: 40px;
      }
    }

    .search-bar {
      left: 3%;
      width: 92%;

      input {
        width: 80%;
        font-size: 18px;
      }
    }
  }

  @media (max-width: 480px) {
    .movie-list {
      grid-template-columns: 1fr;
    }
  }
}
</style>