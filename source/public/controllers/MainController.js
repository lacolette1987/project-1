import { serialize, Todo} from '../models/todos.js';
import * as utility from '../services/Utility.js';



export class MainController{

    async generateEntries() {
        this.listTodos = await this.getNotes(null, null);

        this.reloadElements(this.listTodos);
    }

    reloadElements(listTodos){
        const templateSource = document.getElementById("entry-template").innerHTML;

        // Template ist nur ein String, durch das compile() wird daraus eine Template-Function
        const template = Handlebars.compile(templateSource);

        //die Template-Function kann aufgerufen werden. Als Parameter werden die Daten übergeben.
        document.getElementById("MeineTodos").innerHTML = template(listTodos);

        const elements = document.querySelectorAll(`[id^="edit-"]`);

        elements.forEach(function (item, index){
            item.addEventListener('click', async function () {

                let id = item.id;
                id = id.split('-')[1];
                await updateNote(id, index);
            })
        });

        const elementsDelete = document.querySelectorAll(`[id^="delete-"]`);
        elementsDelete.forEach(function (item){
            item.addEventListener('click', async function (event) {
                event.preventDefault();
                let id = item.id;
                id = id.split('-')[1];
                listTodos = [];
                await utility.deleteNote(id);
                await mainController.generateEntries();
            })
        });
    }

    async resetSort() {
        utility.resetSort();
        await this.generateEntries();
    }

    async getNotes(sortBy, sortOrder) {

            const todoObjects = await utility.getNotes();
            this.listTodos = serialize(todoObjects);

        this.listTodos = utility.getSortedArray(this.listTodos, sortBy, sortOrder);

        return this.listTodos;
    }



}

const mainController = new MainController();


function registerForLoop(){
    Handlebars.registerHelper('times', function(n, block) {
        let accum = '';
        for(let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
}
registerForLoop();

// auslesen des Templates


mainController.generateEntries();

const resetFiltersBtn = document.getElementById("reset");
const addBox = document.querySelector(".add-box #create");

const popupBox = document.querySelector(".popup-box");
const popupEdit = document.getElementById("popup-edit");
const titleSort = document.getElementById("sort-title");
const dateSort = document.getElementById("sort-date");
const prioSort = document.getElementById("sort-prio");
const stateFilter = document.getElementById("sort-filter");

const closeIcon = popupBox.querySelector("#header i");
const dateTag = popupBox.querySelector("#datum");
const titleTag = popupBox.querySelector(".titel input");
const prioTag = popupBox.querySelector(".prio select");
const stateTag = popupBox.querySelector("#create-importance");
const descTag = popupBox.querySelector("textarea");

const dateEditTag = document.getElementById("datum-edit");
const titleEditTag = document.getElementById("titel-edit");
const descriptionEditTag = document.getElementById("beschreibung-edit");
const prioEditTag = document.getElementById("importance-edit");
const stateEditTag = document.getElementById("status-edit");


// Darkmode
const darkIcon = document.getElementById("darkmode");
darkIcon.addEventListener("click", utility.toggleDarkMode);


addBox.addEventListener("click", () => {
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
});


const createNoteForm = document.getElementById("create-note-form");
createNoteForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const duedate = dateTag.value;
    const title = titleTag.value;
    const description = descTag.value;
    const prio = parseInt(prioTag.value);

    let state = "offen";

    const stateTag = document.getElementById("add-status");
    if (stateTag.checked === false)
        state = "offen";
    else
        state = "erledigt";

    await utility.createNote(title, description, duedate, prio, state);
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
    dateTag.value = "";
    titleTag.value = "";
    descTag.value = "";
    prioTag.value = "";
    stateTag.value = 1;

    await mainController.generateEntries();
});


closeIcon.addEventListener("click", () => {

    dateTag.value = "";
    titleTag.value = "";
    descTag.value = "";
    prioTag.value = "";
    stateTag.value = 1;
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

const closeIconEdit = document.getElementById("close-popup-edit");

closeIconEdit.addEventListener("click", () => {
    popupEdit.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});


async function updateNote(noteId, index) {


    const idHolder = document.getElementById("edit-id");
    idHolder.value = noteId;
    let toUpdate;
    mainController.listTodos.forEach((item)=>{
       if(item.id === noteId){
           toUpdate = item;
       }
    });

    const description = toUpdate.filterDesc.replaceAll('<br/>', '\r\n');
    dateEditTag.value = toUpdate.duedate;
    titleEditTag.value = toUpdate.title;
    descriptionEditTag.value = description;
    prioEditTag.value = toUpdate.prio;
    if (toUpdate.state === 'erledigt') {
        stateEditTag.checked = true;
    } else {
        stateEditTag.checked = false;
    }
    popupEdit.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";


}

const updateBtn = document.getElementById("editForm");
updateBtn.addEventListener("submit", async function (ev) {
    ev.preventDefault();
    const idHolder = document.getElementById("edit-id");
    let noteId = idHolder.value;
    let state = "";
    if (stateEditTag.checked === true) {
        state = "erledigt";
    } else {
        state = "offen";
    }

    await utility.updateNote(noteId, titleEditTag.value.trim(), descriptionEditTag.value.trim(), dateEditTag.value.trim(), prioEditTag.value, state);

    dateEditTag.value = "";
    titleEditTag.value = "";
    descriptionEditTag.value = "";
    prioEditTag.value = "";
    stateEditTag.value = 1;
    popupEdit.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
    await mainController.generateEntries();
});


function resetAllIcons(array){
    array.forEach((item)=>{
        if(item.classList.contains("uil-angle-down"))
            item.classList.remove("uil-angle-down");
        if(item.classList.contains("uil-angle-up"))
            item.classList.remove("uil-angle-up");
        if(item.classList.contains("uil-check-circle"))
            item.classList.remove("uil-check-circle");
        item.classList.add("uil-sort");
    })


}
let tSort = 0, dSort = 0, pSort = 0, filter = 0;
const sortTitleIcon = document.getElementById("sortTitleIcon");
const sortDateIcon = document.getElementById("sortDateIcon");
const sortPrioIcon = document.getElementById("sortPrioIcon");
const filterIcon = document.getElementById("filterDoneIcon");

titleSort.addEventListener("click", async (ev) => {
    ev.preventDefault();
    let todosList;

    if (tSort === 1) {
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortTitleIcon.classList.remove("uil-sort");
        sortTitleIcon.classList.add("uil-angle-up");
        todosList = await mainController.getNotes("Title", 'desc');

        tSort = -1;
        dSort = 0;
        pSort = 0;
    } else{
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortTitleIcon.classList.remove("uil-sort");
        sortTitleIcon.classList.add("uil-angle-down");
        todosList = await mainController.getNotes("Title", 'asc');

        tSort = 1;
        dSort = 0;
        pSort = 0;
    }
    if(localStorage.getItem("filter")){
        localStorage.removeItem("filter");
    }
    mainController.reloadElements(todosList);
});


dateSort.addEventListener("click", async (ev) => {
    ev.preventDefault();
    let todosList;

    if (dSort === 1) {
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortDateIcon.classList.remove("uil-sort");
        sortDateIcon.classList.add("uil-angle-up");
        todosList = await mainController.getNotes("Date", 'desc');
        dSort = -1;
        tSort = 0;
        pSort = 0;
    } else {
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortDateIcon.classList.remove("uil-sort");
        sortDateIcon.classList.add("uil-angle-down");
        todosList = await mainController.getNotes("Date", 'asc');
        dSort = 1;
        tSort = 0;
        pSort = 0;
    }
    localStorage.removeItem("filter");
    mainController.reloadElements(todosList);
});



// Nach Prio sortieren

prioSort.addEventListener("click", async (ev) => {
    ev.preventDefault();
    let todosList;

    if (pSort === 1) {
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortPrioIcon.classList.remove("uil-sort");
        sortPrioIcon.classList.add("uil-angle-up");
        todosList = await mainController.getNotes("Prio", 'desc');
        pSort = -1;
        tSort = 0;
        dSort = 0;
    } else {
        resetAllIcons([sortTitleIcon, sortPrioIcon, sortDateIcon]);
        sortPrioIcon.classList.remove("uil-sort");
        sortPrioIcon.classList.add("uil-angle-down");
        todosList = await mainController.getNotes("Prio", 'asc');
        pSort = 1;
        tSort = 0;
        dSort = 0;
    }
    localStorage.removeItem("filter");
    mainController.reloadElements(todosList);
});

resetFiltersBtn.addEventListener('click', ()=>{

    pSort = 0; dSort = 0; tSort=0; filter = 0;
    mainController.resetSort();

});

stateFilter.addEventListener("click", ()=>{
    let erledigt = [];

    if(localStorage.getItem("filter") === null){
        localStorage.setItem("filter", "1");
        mainController.listTodos.forEach((item) =>{
            if(item.state === "erledigt") {
                erledigt.push(item);
            }
        });

        mainController.listTodos= erledigt;
        mainController.reloadElements(mainController.listTodos);
    }else{
        localStorage.removeItem("filter");
        mainController.generateEntries();

    }

});




