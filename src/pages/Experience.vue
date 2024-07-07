<template>
    <div class="main">
        <div class="head-container">
            <img class="img-exp" src="@/images/experience.png" alt="experience">
            <h1>Опыт работы</h1>
        </div>
        <div class="content-container">
            <p>Ни одна из занимаемых мной прежде должностей не имела никакого отношения к веб-разработке.</p>
            <p>Я добросовестно трудился в других сферах.</p>
        </div>
        <!-- <DataTable class="table" :value="items">
            <Column style="background-color: rgb(113, 194, 224); border: 1px solid #043d75; padding: 5px; text-align: center;" field="date" header="Даты/Сроки"></Column>
            <Column style="background-color: rgb(113, 194, 224); border: 1px solid #043d75; padding: 5px; white-space: pre-line;" field="organization" header="Организация/Должность/Должностные обязанности"></Column>
        </DataTable> -->
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
                date: 'Август 2021 — по настоящее время',
                organization: `(*) TEXT.RU биржа копирайтинга. 

                (*) Копирайтер/Рерайтер/Корректор. 

                (*) Написание и редактирование текстов по предварительно согласованному техническому заданию.`,
                }, 
                {
                date: 'Июль 2016 — январь 2021',
                organization: `(*) ООО «Профессиональные сервисные решения» (г.Липецк).

                (*) Мастер, старший мастер производства химической очистки промышленного теплообменного оборудования.

                (*) Должностные обязанности:
                    -  Составление, оформление и подписание необходимой технической документации;
                    -  Определение списка необходимого оборудования и товарно-материальных ценностей для выполнения работ;
                    -  Составление проекта производства работ и его согласование с заказчиком;
                    -  Осуществление координации работ при реализации проектов.`,
                }, 
                {
                date: 'Январь 2015 — июнь 2016',
                organization: `(*) TEXT.RU биржа копирайтинга. 

                (*) Копирайтер/Рерайтер/Корректор. 

                (*) Написание и редактирование текстов по предварительно согласованному техническому заданию.`,
                },
                {
                date: 'Март 2010 — декабрь 2014',
                organization: `(*) ООО «ЭКОС» (г.Липецк). 

                (*) Cлесарь-ремонтник. 

                (*) Химическая очистка промышленного теплообменного оборудования.`,
                },
                {
                date: 'Ноябрь 2006 — март 2010',
                organization: `(*) ОАО «Индезит интернешнл» (г.Липецк). 

                (*) Слесарь механосборочных работ, бригадир. 

                (*) Должностные обязанности:
                 - Выполнение работ на сборочной линии завода стиральных машин;
                 - Руководство бригадой и производственным процессом на сборочной линии завода стиральных машин;
                 - Ремонт стиральных машин на промежуточной ремонтной зоне сборочной линии.`,
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
/* .content-container {
    box-sizing: border-box;
    background-color: rgb(113, 194, 224);
    border: 1px solid #043d75;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
} */
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