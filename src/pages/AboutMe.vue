<template>
    <div class="main">
        <div class="about">
            <div class="head-container">
                <img src="@/images/about.png" alt="about">  
                <h2>Подробнее о себе</h2>  
            </div>
            <div class="content-container">
                <p>Ф.И.О.</p>
                <span>Швецов Александр Владимирович</span>
                <p>Дата рождения:</p>
                <span>02.07.1987 (36 лет)</span>
                <p>Гражданство:</p>
                <span>Россия</span>
                <p>Город проживания:</p>
                <span>Краснодар (не готов к переезду)</span>
                <p>Семейное положение:</p>
                <span>Женат (двое детей)</span>
                <p>Предполагаемая занятость:</p>
                <span>полная занятость, частичная занятость, проектная работа, стажировка</span>
                <p>Предполагаемый график работы:</p>
                <span>полный рабочий день, гибкий график, удаленная работа</span>
                <p>Образование:</p>
                <span>высшее техническое</span>
                <p>Знание английского языка:</p>
                <span>уровень школы/института - уверенно со словарем</span>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
.about {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: 20px;
}
.head-container {
    display: flex;
    align-items: center;
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px 20px;
    position: relative;
    background-color: rgb(113, 194, 224);
    color: #043d75;
    margin: 0 35px 35px 0;
}
img {
    width: 75px;
    height: 90px;
    margin-right: 30px;
}
h2 {
    margin: 0;
}
.content-container {
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px;
    
}
p {
    margin-bottom: 0;
}
span {
    margin: 0;
    font-weight: 600;
}
@media (max-width: 750px) {
    .head-container {
        margin-right: 0;
    }
}      
</style>