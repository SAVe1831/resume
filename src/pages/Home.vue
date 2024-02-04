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
            <p>Меня зовут Александр, мне 36 лет.</p>
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
    margin-top: 20px;
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    padding: 10px;
}
</style>    