<template>
    <div class="main">
        <div class="head-container">
            <div class="hello-container">
                <img class="img-hello" src="@/images/Hello.png" alt="Hello">
                <h1>Добро пожаловать!</h1>
            </div>
            <div class="circle-photo">
                <img class="my-photo" src="@/images/my-photo.png" alt="my photo">
            </div>
        </div>
        <div class="content-container">
            <p>Меня зовут Александр.<br><br>
              Я начинающий веб-разработчик, на данный момент специализируюсь на фреймворке Vue.<br>
              Нахожусь в поиске работы-стажировки позиции веб-верстальщика начального уровня. Готов рассмотреть предложение даже с небольшой заработной платой, но с возможностью обучения для дальнейшего развития.<br><br>
              Считаю себя добросовестным, надежным, внимательным и исполнительным. Открыт для новых знаний в процессе работы над собой.<br><br>
              <u>Мои текущие навыки:</u><br>
               - Хорошее знание HTML, CSS;<br>
               - Небольшой опыт работы с Vue3 и JS;<br>
               - Имеются опыт, знания и понимание процесса работы с инструментами сборки vite;<br>
               - В процессе обучения и создания личных демонстрационных проектов имелся опыт работы со стейт менеджерами Vuex и Pinia;<br>
               - Хорошо знаком и уже использовал UI библиотеки <a href="https://primevue.org">PrimeVue</a>, <a href="https://primeflex.org">PrimeFlex</a> и <a href="https://getbootstrap.com">Bootstrap</a>;<br>
               - Для хранения данных пока выбирал <a href="https://mokky.dev">Mokky.dev</a> и <a href="https://firebase.google.com">firebase;</a> <br>
               - Умею работать с системой контроля версий Git. Имеется аккаунт на <a href="https://github.com/SAVe1831?tab=repositories">GitHub</a> с несколькими репозиториями.<br><br>
               Для более детального рассмотрения моих текущих навыков Вы можете перейти на страницу с небольшим <router-link to="/portfolio">портфолио</router-link>.<br><br>
               Если появилось желание больше узнать обо мне, то Вы можете перейти на следующую <router-link to="/about">вкладку</router-link>.
              </p>
        </div>        
    </div>
</template>

<script>


export default {
    name: 'Home',
    
}
</script>

<style scoped>
.main {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}
.head-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
}
.hello-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
}
.img-hello {
    width: 100px;
}
.circle-photo{
  display: inline-block;
  border-radius: 50%;
  overflow: hidden;
  width: 250px;
  height: 250px;
  margin-top: 5px;
}
.circle-photo .my-photo{
  width:100%;
  height:100%;
  object-fit: cover;
}
.content-container {
    width: 75%;
    margin: 0 auto;
    margin-top: 20px;
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px;
}
@media (max-width: 800px) {
    .content-container {
        width: 90%;
    }
}
</style>    