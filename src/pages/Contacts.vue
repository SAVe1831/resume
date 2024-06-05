<template>
    <div class="main">
        <div class="head-container">
            <img src="@/images/connection.png" alt="connect">
            <h1>Как со мной связаться</h1>
        </div>
        <div class="connect-container">   
            <div>
                <ul>
                    <li>Набрать номер телефона:</li>
                    <li class="contacts">
                        <i class="pi pi-phone"></i>
                        <p><a href="tel:+79628685863">+7(962)868-58-63</a></p> 
                    </li>
                    <li class="contacts">
                        <i class="pi pi-phone"></i>
                        <p><a href="tel:+79046853431">+7(904)685-34-31</a></p> 
                    </li>
                    <li>Написать на электронный почтовый ящик:</li>
                    <li class="contacts">
                        <i class="pi pi-at"></i> 
                    <p><a href="mailto:save1831537@gmail.com">save1831537@gmail.com</a></p>    
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>Мои мессенджеры:</li>
                    <li class="contacts">
                        <i class="pi pi-whatsapp"></i>
                        <p><a href="https://api.whatsapp.com/send?phone=79628685863">WhatsApp +7 (962) 868-58-63</a></p> 
                    </li><li class="contacts">
                        <i class="pi pi-whatsapp"></i>
                        <p><a href="https://api.whatsapp.com/send?phone=79046853431">WhatsApp +7 (904) 685-34-31</a></p> 
                    </li>
                    <li class="contacts">
                        <i class="pi pi-telegram"></i>
                        <p><a href="tg://resolve?domain=save1831">Telegram +7 (904) 685-34-31</a></p> 
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scoped>
.main {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
}
.head-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    margin-top: 20px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
}
img {
    width: 100px;
    height: 90px;
    margin: 0 20px;
}
.connect-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    margin-top: 20px;
    border-radius: 6px;
    padding: 10px; 
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}
ul {
    list-style: none;
    padding: 0;
    margin-left: 10px;
}
.contacts {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
p {
    margin: 8px 10px;
}  
a {
    text-decoration: none;
} 
</style>