import "./styles.css";



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
    constructor(main = null, sidebar = null, list= null) {
        this.main = main;
        this.mainContent = main.innerHTML;
        this.sidebar = sidebar;
        this.list = list;
    }

    clearMain() {
        this.main.innerHTML = "";
    }

    restoreMain() {
        this.main.innerHTML = this.mainContent;
    }

    listAppend(title, id) {
        let li = document.createElement('li');
        
        li.classList.add('project-list-item');
        li.textContent = title;
        li.setAttribute("data-id", id);

        this.list.appendChild(li);
    }
}




// Execution
const storageMaster = new StorageMaster("todos");
const domMaster = new DomMaster(document.querySelector("main"), document.getElementById("sidebar"), document.getElementById("project-list"));
domMaster.listAppend('title', 89888);


storageMaster.firstTodo({
    title: "Study Piano",
    Description: "Work on scales"
});
storageMaster.addItem({
    title: "Paint",
    description: "Do a Caravaggio master copy"
});
console.log(storageMaster.returnArray());
console.log(storageMaster.getItem("title", "Study Piano"));

console.log(storageMaster.removeItem("title", "Study Piano"));
console.log(storageMaster.returnArray());
storageMaster.addSubItem("title", "Paint", {
    title: "Sketch design",
    description: "Paintings don't compose themselves",
});
console.log(storageMaster.returnArray());