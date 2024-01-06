<template>
    <div class="movie-banner">
        <a @click="$router.go(-1)">
            <IconArrowBackUp :size="48" color="white" class="back-button"/>
        </a>
        <img v-if="movie?.backdrop?.url"  :src="movie.backdrop.url" :alt="movie.name + ' poster'" class="movie-backdrop"/>
        <div class="movie-poster">
            <img v-if="movie?.poster?.url" :src="movie.poster.url" :alt="movie.name + ' poster'" />
            <img v-if="!movie?.poster?.url" src="/src/assets/poster-not-available.png"/>
        </div>
        <div class="movie-detail">
            <div class="movie-text">
                <h2>{{ movie.name }}</h2>
                <h4>{{ movie.slogan }}</h4>
                <div class="alternative-names">
                    <span class="name"><strong>Original:</strong> <i>{{ movie.alternativeName }}</i></span><br />
                    <span class="name"><strong>German:</strong> <i>{{ movie.names.filter((n) => n.language == 'DE')[0]?.name }}</i></span>
                </div>
                <div class="production">
                    <strong>Production: </strong>
                    <template v-for="(country, index) in movie.countries" :key="index">
                        <span class="name"><i>{{ country.name }}</i></span>
                        <span v-if="index !== productionCountriesLength - 1"><i>, </i></span>
                    </template>                    
                </div>
                <div class="movie-genres">
                    <template v-for="(genre, index) in genres" :key="genre.id">
                        <span class="genre-name"><i>{{ genre.name }}</i></span>
                        <span v-if="index !== genres.length - 1"><i>, </i></span>
                    </template>
                </div>
                <div class="movie-datetime">
                    <span><IconClock :size="24"/>{{ movie.movieLength }} mins</span>
                    <span><IconCalendarStats :size="24" />{{ year }}</span>
                    <span title="Kinopoisk rating"><IconStar :size="24" />{{ rating?.kp }}</span>
                    <span title="IMDB rating"><IconMovie :size="24" />{{ rating?.imdb }}</span>
                </div>
                <div class="movie-persons">
                    Режисёр:
                    <template v-for="(director, index) in directors" :key="director.id">
                        <span class="person-name"><i>{{ director.name }}</i></span>
                        <span v-if="index !== directors?.length || 0 - 1"><i>, </i></span>
                    </template>
                </div>
                <div class="movie-persons">
                    Актёры:
                    <template v-for="(actor, index) in actors?.slice(0, 5)" :key="actor.id">
                        <span class="person-name"><i>{{ actor.name }} ({{ actor.description }})</i></span>
                        <span v-if="index !== 4"><i>, </i></span> <!-- output for 5 actors only (0-4) -->
                    </template>
                </div>
                <p>{{ movie.description }}</p>
            </div>
        </div>
    </div>

    <div class="movie-detail">

    </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { useRoute } from 'vue-router';
import '@/assets/base.css';
import { IconStar, IconClock, IconArrowBackUp, IconCalendarStats, IconMovie } from '@tabler/icons-vue';
import {
  KinopoiskDev, type MovieDtoV1, type Rating, type PersonInMovie, type Images
} from '@openmoviedb/kinopoiskdev_client';

interface Genre {
    id:number
    name: string
}

function createEmptyMovieDtoV1(): MovieDtoV1 {
  return {
    id: 0,
    names: [],
    type: '',
    externalId: {},
    typeNumber: 0,
    facts: [],
    imagesInfo: {} as Images,
    productionCompanies: []
  };
}

const movie = ref<MovieDtoV1>(createEmptyMovieDtoV1());
const route = useRoute();
const genres = ref<Genre[]>([]);
const year = ref(0);
const rating = ref<Rating | undefined>({})
const directors = ref<PersonInMovie[] | undefined>([])
const actors = ref<PersonInMovie[] | undefined>([])

const productionCountriesLength = computed(() => {
  return movie.value.countries ? movie.value.countries.length : 0;
})

const kp = new KinopoiskDev(`${import.meta.env.VITE_KINOPOISK_API_KEY}`);

onBeforeMount(async () => {
    try {
        const { data, error, message } = await kp.movie.getById(parseInt(route.params.id as string));
        if (data) {
            console.log("Single movie data:")
            console.log(data);
            movie.value = data  // returns a Movie object
            genres.value = movie.value.genres as { id: number; name: string; }[];
            year.value = movie.value.year || 1900;
            rating.value = movie.value.rating;    

            const persons = movie.value.persons;
            directors.value = persons?.filter(person => person.enProfession == 'director' && person.id)
            actors.value = persons?.filter(person => person.enProfession == 'actor' && person.id)
        }

        if (error) console.log(error, message);
    } catch (error) {
        console.error(error);
    }

});

</script>

<style lang="scss" src="./MovieDetail.scss" />