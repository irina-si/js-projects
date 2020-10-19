function checkLocalStorage() {
    if (!localStorage.items) {
        let itemsArray = [];
        localStorage.setItem('items', JSON.stringify(itemsArray));
    }
}

function getLocalStorageList() {
    const data = JSON.parse(localStorage.getItem('items'));
    if (data) { 
        data.forEach(item => {
            document.querySelector(".list").insertAdjacentHTML(
                "afterbegin", createList(item)
            )
        })
    }
}

function createList(item) {
    if (item.isChecked) {
        return `<li class='list-element' todoId=${item.id}>
                <label class="list-element-completed"><input type="checkbox" name="scales" checked>${item.value}</label>
                <span id="x">X</span>
                </li>`;
        } else {
            return `<li class='list-element' todoId=${item.id}>
                    <label><input type="checkbox" name="scales">${item.value}</label>
                    <span id="x">X</span>
                    </li>`;
        }
}

function addItem(event) {
    checkLocalStorage();

    event.preventDefault();
    event.stopPropagation();

    const itemId = `f${(~~(Math.random()*1e8)).toString(16)}`;
    let itemValue = this.itemText.value;
    
    let newItem = {
        id: itemId,
        value: itemValue,
        isChecked: false,
    }

    const data = JSON.parse(localStorage.getItem('items'));
    data.push(newItem);
    localStorage.setItem('items', JSON.stringify(data));

    document.querySelector(".list").insertAdjacentHTML(
        "afterbegin", createList(newItem)
    );
    this.itemText.value = '';
}

function checkItem(event) {
    let listItem = event.target;
    if (listItem.tagName != "INPUT") return;
    listItem.closest("label").classList.toggle("list-element-completed");

    let currentId = listItem.closest("li").getAttribute("todoId");
    const data = JSON.parse(localStorage.getItem('items'));
    data.forEach((item) => {
        if (item.id == currentId) {
            item.isChecked = !item.isChecked;
        }
    })
    localStorage.setItem('items', JSON.stringify(data));
}

function deleteItem(event) {
    if (event.target.id != "x") return;
    let currentId = event.target.closest("li").getAttribute("todoId");
    const data = JSON.parse(localStorage.getItem('items'));
    for (i = 0; i < data.length; i++) {
        if (data[i].id == currentId) {
            data.splice(i, 1);
        }
    }
    localStorage.setItem('items', JSON.stringify(data));
    event.target.closest("li").remove();
}

function getCompletedItems(event) {
    event.preventDefault();
    event.stopPropagation();

    list.innerHTML = "";
    const data = JSON.parse(localStorage.getItem('items'));
    let completedItemsArr = data.reduce((total, item) => {
        if (item.isChecked == true) {
            total.push(item);
        } 
        return total;
    }, []);

    completedItemsArr.forEach( item => {
        document.querySelector(".list").insertAdjacentHTML(
            "afterbegin", createList(item)
        );
    });
 }

function getIncompletedItems(event) {
    event.preventDefault();
    event.stopPropagation();

    list.innerHTML = "";
    const data = JSON.parse(localStorage.getItem('items'));
    let completedItemsArr = data.reduce((total, item) => {
        if (item.isChecked == false) {
            total.push(item);
        } 
        return total;
    }, []);

    completedItemsArr.forEach( item => {
        document.querySelector(".list").insertAdjacentHTML(
            "afterbegin", createList(item)
        );
    });
}

function showAllItems(event) {
    event.preventDefault();
    event.stopPropagation();

    list.innerHTML = "";
    const data = JSON.parse(localStorage.getItem('items'));
    data.forEach( item => {
        document.querySelector(".list").insertAdjacentHTML(
            "afterbegin", createList(item)
        );
    });
}

const list = document.querySelector(".list");
const addItemForm = document.getElementById("addItemForm");
const completedFilterButton = document.getElementById("completed");
const incompletedFilterButton = document.getElementById("incompleted");
const showAllButton = document.getElementById("showAll");

checkLocalStorage();
getLocalStorageList();

list.onchange = checkItem;
addItemForm.onsubmit = addItem;
list.onclick = deleteItem;
completedFilterButton.onclick = getCompletedItems;
incompletedFilterButton.onclick = getIncompletedItems;
showAllButton.onclick = showAllItems;





