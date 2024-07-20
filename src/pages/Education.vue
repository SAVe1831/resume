<template>
    <div class="main">
        <div class="education">
            <div class="head-container">
                <img src="@/images/education.png" alt="education">  
                <h2>Моё образование</h2>  
            </div>
            <div class="content-container">
                <p><strong>Высшее техническое</strong></p>
                <p>Липецкий Государственный Технический Университет (ЛГТУ)</p>
                <p>Факультет: Механико-машиностроительный (ММФ)</p>
                <p>Специальность: Технология машиностроения</p>
                <p>Год окончания: 2012</p>
                <p><strong>Дополнительное образование</strong></p>
                <p>Образовательная онлайн платформа ООО "Нетология"</p>
                <p>Специальность: JavaScript-программирование</p>
                <p>Год окончания: 2023</p>
                <p>Параллельно проходило самостоятельное изучение фреймворка Vue3.</p>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
.education {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: 20px;
}
.head-container {
    display: flex;
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px;
    position: relative;
    background-color: rgb(113, 194, 224);
    color: #043d75;
    margin: 0 35px 35px 0;
}
.head-container::after, .head-container::before {
    content: '';
    position: absolute;
    background-color: rgb(113, 194, 224);
    left: 280px; bottom: 10px;
    width: 50px; height: 50px;
    box-shadow: 0 0 7px #000; 
    z-index: -1;
    transform: rotate(45deg); 
    -webkit-transform: rotate(45deg);
}
.head-container::before {
    z-index: 1;
    box-shadow: none;
}
img {
    width: 75px;
    height: 90px;
    margin-right: 10px;
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

@media (max-width: 834px) {
    .head-container::after, .head-container::before {
        left: 200px; bottom: -15px;
    }
};
@media (max-width: 750px) {
    .head-container {
        margin-right: 0;
    }
}
</style>