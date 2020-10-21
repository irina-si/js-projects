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
                <div class="controls"> 
                <span class="button__edit"></span>
                <span class="button__delete"></span>
                </div>
                </li>`;
        } else {
            return `<li class='list-element' todoId=${item.id}>
                    <label><input type="checkbox" name="scales">${item.value}</label>
                    <div class="controls">            
                    <span class="button__edit"></span>
                    <span class="button__delete"></span>
                    </div>
                    </li>`;
        }
}

function editingElement (item) {
    return ;
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

function editItem(event) {
    event.preventDefault(); 
    
    let li = event.target.closest("li");
    // li.tabIndex = "1";
    li.insertAdjacentHTML("afterbegin", 
    `<textarea id='edit' style="display:none" wrap="off">
     ${li.querySelector("label").textContent}</textarea>`);

    let textarea = document.getElementById("edit");
    console.log(textarea);
    focusIn();  

    textarea.addEventListener("focusout", focusOut);
    textarea.addEventListener("keydown", ()=> {
      if (event.code == "Enter") focusOut();
      })

    function focusIn (event) {
        textarea.style.display = 'block';
        textarea.focus();
        console.log(li.querySelector("label"));
        li.querySelector("label").outerHTML = '';   
    }
  
    function focusOut () {
        li.insertAdjacentHTML("afterbegin", 
        `<label><input type="checkbox" name="scales">${textarea.value}</label>`);
        textarea.remove();
        saveNewItem();
    }
    
    function saveNewItem() {
    let currentId = li.getAttribute("todoId");
    const data = JSON.parse(localStorage.getItem('items'));
    data.forEach((item) => {
        if (item.id == currentId) {
            item.value = li.querySelector("label").textContent;
        }
    })
    localStorage.setItem('items', JSON.stringify(data));
}
    
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
completedFilterButton.onclick = getCompletedItems;
incompletedFilterButton.onclick = getIncompletedItems;
showAllButton.onclick = showAllItems;

list.addEventListener("click", function(event) {
    console.log(event.target.classList);
    console.dir(event.target);
    if (event.target.classList.contains("button__edit")) {
        editItem(event);
    } else if (event.target.classList.contains("button__delete"))
        deleteItem(event);
})
