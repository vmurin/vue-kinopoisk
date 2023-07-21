<template>
    <div class="movie-banner">
        <a @click="$router.go(-1)">
            <IconArrowBackUp :size="48" color="white" class="back-button"/>
        </a>
        <img v-if="movie.backdrop?.url"  :src="movie.backdrop.url" :alt="movie.name + ' poster'" class="movie-backdrop"/>
        <div class="movie-poster">
            <img v-if="movie.poster?.url" :src="movie.poster.url" :alt="movie.name + ' poster'" />
            <img v-if="!movie.poster?.url" src="/src/assets/poster-not-available.png"/>
        </div>
        <div class="movie-detail">
            <div class="movie-text">
                <h2>{{ movie.name }}</h2>
                <h4>{{ movie.slogan }}</h4>
                <div v-for="genre in genres" class="movie-genres">
                    <span v-if="genres.indexOf(genre) !== genres.length - 1" class="genre-name"><i>{{ genre.name }}, </i></span>
                    <span v-else class="genre-name"><i>{{ genre.name }}</i></span>
                </div>
                <div class="movie-datetime">
                    <span><IconClock :size="24"/>{{ movie.movieLength }} mins</span>
                    <span><IconCalendarStats :size="24" />{{ year }}</span>
                    <span><IconStar :size="24" />{{ rating.kp }}</span>
                </div>
                
                <p>{{ movie.description }}</p>
            </div>
        </div>
    </div>

    <div class="movie-detail">

    </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/base.css';
import { IconStar, IconClock, IconArrowBackUp, IconCalendarStats } from '@tabler/icons-vue';

const apiKey = import.meta.env.VITE_API_KEY

const movie = ref({});
const route = useRoute();
const genres = ref([]);
const year = ref("");
const rating = ref("")

import {
  KinopoiskDev,
  MovieQueryBuilder,
  SPECIAL_VALUE,
  SORT_TYPE,
  type MeiliMovieEntity
} from '@openmoviedb/kinopoiskdev_client';

const kp = new KinopoiskDev(`${import.meta.env.VITE_KINOPOISK_API_KEY}`);

onBeforeMount(async () => {
    try {
        const { data, error, message } = await kp.movie.getById(parseInt(route.params.id as string));
        if (data) {
            console.log("Single movie data:")
            console.log(data);
            movie.value = data  // returns a Movie object
            genres.value = movie.value.genres;
            year.value = movie.value.year;
            rating.value = movie.value.rating;    
        }

        // Если будет ошибка, то выведем ее в консоль
        if (error) console.log(error, message);
    } catch (error) {
        console.error(error);
    }

});

</script>


<style lang="scss">

    .back-button {
        color: black;
        font-size: 40px;
        position: absolute;
        top: 10px;
        left: 10px;
        cursor: pointer;
    }

    .back-button:hover {
        color: white;
    }

    .movie-banner {
        position: relative;
        width: 100%;
        min-height: 91vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to right, rgba(181, 180, 180, 0.2), 30%, rgba(0, 0, 0, 0.7));

        .movie-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: -1;
        }

        .movie-detail {
            display: flex;
            justify-content: flex-start;
            width: 80%;

            .movie-text {
                color: white;
                margin-left: 40px;
                height: 100%;
                position: relative;
                bottom: 60px;

                h2 {
                    font-size: 60px;
                    font-weight: 600;
                    margin-bottom: 7px;
                    max-width: 60%;
                    line-height: 100%;
                }

                h4 {
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 15px;
                    letter-spacing: 2px;
                }

                .movie-genres {
                    display: inline;

                    .genre-name {
                        font-size: 17px;
                        font-weight: 300;
                    }
                }

                .movie-datetime {
                    margin-top: 5px;
                    margin-bottom: 15px;
                    font-size: 16px;
                    font-weight: 300;
                    display: flex;
                    column-gap: 15px;

                    span {
                        .icon {
                            margin-right: 4px;
                            font-size: 14px;
                            position: relative;
                            top: 2px;
                        }
                    }
                }

                p {
                    max-width: 50%;
                    font-weight: 200;
                    font-size: 16px;
                    letter-spacing: 1px;
                }
            }
        }

        .movie-poster {
            position: relative;
            width: 400px;
            height: auto;
            margin-left: 120px;

            img {
                width: 100%;
                border-radius: 20px;
            }
        }
    }

</style>