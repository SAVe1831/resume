<template>
    <div class="main">
        <div class="portfolio">
            <div class="head-container">
                <img src="@/images/portfolio.png" alt="portfolio">  
                <h2>Портфолио</h2>  
            </div>
            <div class="content-container">
                <h4>Пока список выглядит скромно, но обязательно будет стремительно увеличиваться!</h4>
                <p>1. <a href="https://save1831.github.io/online_store">Онлайн-магазин товаров для домашних животных</a> и соответствующая <a href="https://github.com/SAVe1831/online_store">ссылка на GitHub</a></p>
                <p>2. <a href="https://save1831.github.io/Photographer-s-website">Веб-сайт фотографа</a> и соответствующая <a href="https://github.com/SAVe1831/Photographer-s-website">ссылка на GitHub</a></p>
                <p>3. <a href="https://save1831.github.io/The-Rick-and-Morty-API">The-Rick-and-Morty-API (фильтрация)</a> и соответствующая <a href="https://github.com/SAVe1831/The-Rick-and-Morty-API">ссылка на GitHub</a></p>
                <p>4. <a href="https://save1831.github.io/hangman/">Hangman (игра Виселица)</a> и соответствующая <a href="https://github.com/SAVe1831/hangman">ссылка на GitHub</a></p>
                <p>5. <a href="https://save1831.github.io/favorite_movies">Топ-50 фильмов Кинопоиска</a> и соответствующая <a href="https://github.com/SAVe1831/favorite_movies">ссылка на GitHub</a></p>
                <p>6. <a href="https://save1831.github.io/resume">Данное резюме</a> и соответствующая <a href="https://github.com/SAVe1831/resume">ссылка на GitHub</a></p><br>
                <p>А это просто ссылка на <a href="https://github.com/SAVe1831?tab=repositories">мой GitHub</a> - там есть что-то ещё.</p>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
.portfolio {
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
@media (max-width: 750px) {
    .head-container {
        margin-right: 0;
    }
}    
</style>