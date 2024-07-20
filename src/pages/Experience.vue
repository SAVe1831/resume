<template>
    <div class="main">
        <div class="head-container">
            <img class="img-exp" src="@/images/experience.png" alt="experience">
            <h1>Опыт работы</h1>
        </div>
        <DataTable class="table" :value="items">
            <Column style="background-color: rgb(113, 194, 224); border: 1px solid #043d75; padding: 5px; text-align: center;" field="date" header="Даты/Сроки"></Column>
            <Column style="background-color: rgb(113, 194, 224); border: 1px solid #043d75; padding: 5px; white-space: pre-line;" field="organization" header="Организация/Должность/Должностные обязанности"></Column>
        </DataTable>
    </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column'


export default {
    components: {
        DataTable, Column
    },
    data() {
        return {
            items: [
                {
                date: 'Август 2023 — по настоящее время',
                organization: `(*) Индивидуальное предпринимательство / частная практика / фриланс. 

                (*) Frontend-разработчик. 

                (*) Разработка либо создание по готовым шаблонам (Figma, PSD) пользовательского адаптивного интерфейса для веб-приложений и веб-сайтов.`
                }, 
                {
                date: 'Сентябрь 2022 — июль 2023',
                organization: `(*) Образовательная онлайн платформа ООО "Нетология".

                (*) Студент-стажер.

                (*) В процессе прохождения курса обучения были изучены следующие темы:
                    -  Верстка сайта на HTML и CSS;
                    -  Верстка по готовым макетам PSD и Figma;
                    -  Адаптивная и мобильная верстка;
                    -  Основы программирования;
                    -  Основы JavaScript;
                    -  Основы JavaScript в браузере;
                    -  Система контроля версий Git.
                    Параллельно проходило самостоятельное изучение фреймворка Vue3.`
                } 
            ]
        }
    }
}
</script>

<style scoped>
.main {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
}
.head-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    margin: 0 20px 20px 0;
}   
.img-exp {
    width: 100px;
}
.content-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
}
.content-container {
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px;
    
}
p {
    font-size: 30px;
}
@media (max-width: 750px) {
    .head-container {
        margin-right: 0;    
    }
}
</style>