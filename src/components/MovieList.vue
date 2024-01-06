<template>
    <div class="movie-list">
      <div class="movie-card" @click="() => openMovie(movie)" v-for="movie in movies" :key="movie.id">
          <img v-if="movie.poster" :src="movie.poster" :alt="movie.name + ' poster'" />
          <img v-if="!movie.poster" src="/src/assets/poster-not-available.png"/>
          <div class="movie-detail">
            <h3>{{ movie.name }}</h3>
            <h3>{{ movie.year }}</h3>
            <div class="movie-ratings">
              <span>{{ movie.rating }}</span> <icon-star />
            </div>
            <p v-if="movie.description !== ''">{{ movie.description }}</p>
            <p v-else>Click to see more details</p>
          </div>
      </div>
    </div>
</template>


<script setup lang="ts">
import router from '@/router';
import type { Movie } from '@openmoviedb/kinopoiskdev_client';
import { IconStar } from '@tabler/icons-vue';

defineProps<{
  movies: any[]
}>()

function openMovie(movie: Movie) {
  router.push('/movie/' + movie.id)
}

</script>


<style lang="scss">
// MOVIE 
  .movie-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 80px;
    max-height: 75%;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    gap: 10px;
    &::-webkit-scrollbar {
      display: none;
    }
    .movie-card {
      cursor: pointer;
      position: relative;
      width: 300px;
      background-color: transparent;
      border-radius: 20px;
      overflow: hidden;
      img {
        object-fit: cover;
        max-width: 100%;
        height: 100%;
        vertical-align: middle;

        width: 100%;
        transition: 0.5s;
      }
      &::before {
        content: '';
        position: absolute;
        bottom: -170px;
        width: 100%;
        height: 100%;
        background: linear-gradient(0deg, var(--card-overlay-color) 50%, transparent);
        transition: 0.5s;
        z-index: 1;
      }
      &:hover {
        .movie-poster::before {
          bottom: 0px;
        }
        .movie-poster {
          img {
            transform: translateY(-50px);
            filter: blur(3px);
          }
        }
        .movie-detail {
          bottom: 8px;
        }
      }
      .movie-detail {
        position: absolute;
        bottom: -90px;
        left: 0;
        padding: 20px;
        width: 100%;
        z-index: 2;
        transition: 0.5s;
        h3 {
          color: white;
          font-weight: 500;
          font-size: 28px
        }
        .movie-ratings {
          margin-bottom: 15px;
          padding-top: 15px;
        }
        span {
          color: var(--movie-card-text-color);
          font-weight: 400;
          font-size: 18px;
        }
        
        p {
          color: var(--movie-card-text-color);
          font-weight: 200;
          font-size: 14px;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .star-icon {
          color: yellow;
          margin-left: 4px;
          padding-top: 2.3px;
        }
      }
    }
  }
</style>