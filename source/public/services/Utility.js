export function toggleDarkMode(){
    if(document.body.classList.toggle("dark-theme")) {
        darkIcon.innerHTML = `<i class="uil uil-toggle-off"></i>`;
    } else {
        darkIcon.innerHTML = `<i class="uil uil-toggle-on"></i>`;
    }
}

export async function createNote(title, description, duedate, prio, state){
    let url = "http://localhost:3000/api/notes/create";
    let data = JSON.stringify({"title": title, "description": description, "duedate": duedate, "prio": prio, "state": state});
    let result = await sendData("POST", url, data, 201 );

}

export async function updateNote(id,title, description, duedate, prio, state){
        let url = "http://localhost:3000/api/notes/update/"+id;
        let data = JSON.stringify({"title": title, "description": description, "duedate": duedate, "prio": prio, "state": state});
        let result = await sendData("POST", url, data, 200);
        return result;
}

export async function deleteNote(id){

    let url = "http://localhost:3000/api/notes/delete/"+id;
    return  await sendNoBody("DELETE", url, null, 200);
}

export async function getNotes() {

    let url = "http://localhost:3000/api/notes";
    let data = await sendNoBody("GET", url);
    return data;
}

const sendData = async (method, url, data, status ) => {

        const rawResponse = await fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        });
        const content = await rawResponse.json();
        return content;

}

const sendNoBody = async (method, url) => {
    const rawResponse = await fetch(url, {
        method: method,
    });
    const content = await rawResponse.json();
    return content;
}


export function sortTitle(array) {

    return array.sort((a,b) => {

        const titleA = a.title.toUpperCase();
        const titleB = b.title.toUpperCase();

        let comparison = 0;
        if (titleA > titleB) {
            comparison = 1;
        } else if (titleA < titleB) {
            comparison = -1;
        }
        return comparison;
    })
}


export function sortDate(array) {

    return array.sort((a,b) => {

        let comparison = 0;
        if (a.duedate > b.duedate) {
            comparison = 1;
        } else if (a.duedate < b.duedate) {
            comparison = -1;
        }
        return comparison;
    })
}


export function sortPrio(array) {
    return array.sort((a,b) => {

        let comparison = 0;
        if (a.prio > b.prio) {
            comparison = 1;
        } else if (a.prio < b.prio) {
            comparison = -1;
        }
        return comparison;
    })
}



function sort(array, sortBy, sortOrder){
    if(sortBy ==="Title"){
        array = sortTitle(array);
    }

    if(sortBy ==="Date"){
        array = sortDate(array);
    }

    if(sortBy ==="Prio"){
        array = sortPrio(array);
    }

    if(sortOrder === 'desc'){
        array = array.reverse();
    }


    return array;
}

function getSortBySettings(){
    return localStorage.getItem("sortBy");
}

function getSortOrderSettings(){
    return localStorage.getItem("sortOrder");
}
export function resetSort(){
    localStorage.removeItem("sortOrder");
    localStorage.removeItem("sortBy");
}

export function getSortedArray(array, sortBy, sortOrder){
    if(sortBy !== null && sortOrder !== null){
        if(getSortBySettings()!== null && getSortOrderSettings() !== null){
           resetSort();
        }
        setSortSettings(sortBy, sortOrder);
        return sort(array, sortBy, sortOrder);
    }

    if(getSortBySettings()!== null && getSortOrderSettings() !== null){
        return sort(array, getSortBySettings(), getSortOrderSettings());
    } else {
        return array;
    }
}

function setSortSettings(sortBy, sortOrder){
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("sortOrder", sortOrder);
}
