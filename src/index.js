import "./styles.css";
import newWhite from "./assets/images/new-white.png";
import newGreen from "./assets/images/new_green.png";
import trash from "./assets/images/trash-white.png";
import trashGreen from "./assets/images/trash-green.png";
// Find a way to wrap this in a MAIN FUNCTION


class ListItem {
    constructor ({ title, description }) {
        this.title = title;
        this.description = description;
        this.id = crypto.randomUUID();
    }
}

class StorageMaster {
    constructor(key) {
        this.key = key;
    }

    updateStorage(arr) {
        localStorage.setItem(`${this.key}`, JSON.stringify(arr));
    }

    getItem(key, value) {
        let arr = JSON.parse(localStorage.getItem(`${this.key}`));
        // search todos for item
        return arr.find((todo) => todo[key] === value );
        // return item
    }

    addItem(item) {
        let arr = JSON.parse(localStorage.getItem(`${this.key}`));

        arr.push(item);
        this.updateStorage(arr);
    }

    removeItem(key, value) {
        let arr = JSON.parse(localStorage.getItem(`${this.key}`));
        const ind = arr.indexOf(arr.find((todo) => todo[key] === value ));
        
        if (ind !== -1) {
            arr.splice(ind, 1);
            this.updateStorage(arr);
        }
    }

    addSubItem(key, value, subItem) {
        let item = this.getItem(key, value);

        if (item.items) {
            this.removeItem(key, value);
            item.items.push(subItem);
            this.addItem(item);
        }
        else {
            this.removeItem(key, value);
            item.items = [];
            item.items.push(subItem);
            this.addItem(item);
        }
    }

    returnArray() {
        return JSON.parse(localStorage.getItem(`${this.key}`));
    }

    firstTodo(item) {
        let arr = [];
        arr.push(item);

        this.updateStorage(arr);  
    }
}

class DomMaster {
    constructor(storage, main = null, subMain = null, sidebar = null, list= null, closeBtn = null) {
        this.storage = storage;
        this.main = main;
        this.mainContent = main.innerHTML;
        this.subMain = subMain;
        this.sidebar = sidebar;
        this.list = list;
        this.closeBtn = closeBtn;
        this.cans = [];
    }

    clearMain() {
        this.main.innerHTML = "";
        this.subMain.innerHTML = "";
    }

    restoreMain() {
        this.main.innerHTML = this.mainContent;
    }

    createMainCard(item) {
        this.clearMain();

        const title = document.createElement('h2');
        const description = document.createElement('p');

        title.textContent = item.title;
        description.textContent = item.description;

        this.main.appendChild(title);
        this.main.appendChild(description);

        if (item.items) {
            item.items.forEach(subItem => {
                this.createSubCard(subItem);
            });
        }
    }

    createSubCard(subItem) {
        const title = document.createElement('h3');
        const description = document.createElement('p');

        title.textContent = subItem.title;
        description.textContent = subItem.description;

        this.subMain.appendChild(title);
        this.subMain.appendChild(description);
    }

    clearList() {
        this.list.innerHTML = "";
    }

    listAppend(title, id) {
        // data-id require for click event to send to-do
        // to StorageMaster to find To-Do
        let li = document.createElement('li');
        
        li.classList.add('project-list-item');
        li.textContent = title;
        li.setAttribute("data-id", id);

        this.list.appendChild(li);
    }

    createLi(item) {
        let li = document.createElement('li');
        
        li.classList.add('project-list-item');
        li.setAttribute("data-id", item.id); 
        li.textContent = item.title;


        li.addEventListener('click', () => {
            this.createMainCard(item);
        });

        return li;
    }

    removeFromList(data) {
        const li = document.querySelector(`[data-id='${data}']`);
        document.removeChild(li);
    }

    refreshList(arr) {
        this.clearList();
        this.cans = [];

        // Repaint UL with list items found in storage
        arr.forEach(item => {
            let li = this.createLi(item);
            const can = new Image();
            can.src = trash;
            can.li = li;

            can.addEventListener('mouseenter', () => {
                can.src = trashGreen;
            });
            can.addEventListener('mouseleave', () => {
                can.src = trash;
            });
            this.cans.push(can);

            this.list.appendChild(li);
            this.list.appendChild(can);
        });

        // Set event listener on trashcan to 
        // delete from Storage then repaint
        this.cans.forEach(can => {
            can.addEventListener('click', () => {
                this.storage.removeItem("id", can.li.dataset.id);
                this.refreshList(this.storage.returnArray());
            });
        });

        this.clearMain();
    }
}




// Execution
function mainFuncton() {
    const newBtn = document.getElementById('new-btn');
    newBtn.addEventListener('mouseenter', () => {
        newBtn.src = newWhite;
    });
    newBtn.addEventListener('mouseleave', () => {
        newBtn.src = newGreen;
    });

    const storageMaster = new StorageMaster("todos");
    const domMaster = new DomMaster(storageMaster,
        document.getElementById("project-info-div"), 
        document.getElementById("sub-tasks-div"), 
        document.getElementById("sidebar"), 
        document.getElementById("project-list"), 
        document.getElementById('close-btn'));

    domMaster.closeBtn.addEventListener('click', () => {
        domMaster.clearMain();
    });





    storageMaster.firstTodo(
        new ListItem({
            title: "Study Piano",
            description: "Work on scales",
        }));
    storageMaster.addItem(
        new ListItem({
        title: "Paint",
        description: "Do a Caravaggio master copy",
    }));
    storageMaster.addSubItem("title", "Paint", {
        title: "Sketch design",
        description: "Paintings don't compose themselves",
    });


    console.log(storageMaster.returnArray());
    domMaster.refreshList(storageMaster.returnArray());
    domMaster.createMainCard(storageMaster.getItem('title', "Paint"));

    console.log(domMaster.storage);
}
mainFuncton();