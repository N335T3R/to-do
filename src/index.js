import "./styles.css";
import newWhite from "./assets/images/new-white.png";
import newGreen from "./assets/images/new_green.png";
import trash from "./assets/images/trash-white.png";
import trashGreen from "./assets/images/trash-green.png";
// Find a way to wrap this in a MAIN FUNCTION


class ListItem {
    constructor ({ title, description, dueDate, priority }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
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

    // getSubItem() {}

    // Needs tested
    removeSubItem(key, value, subKey, subValue) {
        // get item
         let arr = JSON.parse(localStorage.getItem(`${this.key}`));
         const item = arr.find((todo) => todo[key] === value);
        // get subItem index
         const itemArr = item.items;
         const ind = itemArr.indexOf(itemArr.find((subItem) => subItem[subKey] === subValue));

         if (ind !== -1) {
            itemArr.splice(ind, 1);
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

         let arr = JSON.parse(localStorage.getItem(`${this.key}`));
         this.updateStorage(arr);
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
    constructor(storage, main = null, subMain = null, sidebar = null, list= null, closeBtn = null, newTaskModal = null, newTaskForm = null, taskProject) {
        this.storage = storage;
        this.main = main;
        this.mainContent = main.innerHTML;
        this.subMain = subMain;
        this.sidebar = sidebar;
        this.list = list;
        this.closeBtn = closeBtn;
        this.newTaskModal = newTaskModal;
        this.newTaskForm = newTaskForm;
        this.taskProject = taskProject;
        // cans refreshed in refreshList()
        this.cans = [];
        // subCans refreshed in clearMain()
        this.subCans = [];
    }

    clearMain() {
        this.main.innerHTML = "";
        this.subMain.innerHTML = "";
        this.subCans = [];
    }

    restoreMain() {
        this.main.innerHTML = this.mainContent;
    }

    // used in ?
    refreshTasks(item) {
        this.subMain.innerHTML = "";

        const taskHeader = document.createElement('div');
        taskHeader.classList.add("sub-tasks-header");
        this.subMain.appendChild(taskHeader);

        const h = document.createElement('h2');
        h.textContent = "Tasks";
        taskHeader.appendChild(h);
        
        const newTaskBtn = document.createElement('img');
        newTaskBtn.classList.add("new-task-btn");
        newTaskBtn.src = newGreen;
        newTaskBtn.addEventListener('mouseenter', () => {
            newTaskBtn.src = newWhite;
        });
        newTaskBtn.addEventListener('mouseleave', () => {
            newTaskBtn.src = newGreen;
        });
        taskHeader.appendChild(newTaskBtn);
        newTaskBtn.addEventListener('click', () => {
            this.newTaskModal.showModal();
            this.taskProject.value = `${item.id}`
        });
    }

    createMainCard(item) {
        this.clearMain();
        this.refreshTasks(item);

        // Create Card
        const title = document.createElement('h1');
        const description = document.createElement('p');
        const date = document.createElement('p');
        const priority = document.createElement('p');
        const wrapper = document.createElement('div');
        wrapper.classList.add('project-wrapper');

        title.textContent = item.title;
        description.textContent = item.description;
        date.textContent = item.dueDate;
        priority.textContent = item.priority;

        this.main.appendChild(title);
        wrapper.appendChild(description);
        wrapper.appendChild(date);
        wrapper.appendChild(priority);

        this.main.appendChild(wrapper);

        // Check for subitems and create card
        if (item.items) {
            item.items.forEach(subItem => {
                this.createSubCard(item, subItem);
            });
        }


    }

    createSubCard(item, subItem) {
        const title = document.createElement('h3');
        const description = document.createElement('p');
        const wrapper = document.createElement('div');
        wrapper.classList.add("task-wrapper");
        const subCan = new Image();
        subCan.src = trash;

        // set text-content
        title.textContent = subItem.title;
        description.textContent = subItem.description;

        // appendations
        wrapper.appendChild(title);
        wrapper.appendChild(description);
        this.subMain.appendChild(wrapper);

        // trash can code
        this.subCans.push(subCan);
        subCan.classList.add("subcan");
        wrapper.appendChild(subCan);

        // addEventListener to trash can to {
        // domMaster.removeSubItem(item, subItem);
        //  ^^ OR ^^ (key, value, key, value);
        // this.refreshTasks(item);
        // }
        subCan.addEventListener('click', () => {
            // code for can
        });
    }

    // used in refreshList()
    clearList() {
        this.list.innerHTML = "";
    }

    // unsure if used
    listAppend(title, id) {
        // data-id require for click event to send to-do
        // to StorageMaster to find To-Do
        let li = document.createElement('li');
        
        li.classList.add('project-list-item');
        li.textContent = title;
        li.setAttribute("data-id", id);

        this.list.appendChild(li);
    }

    // used in this.refreshList()
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

    // Not used
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
    // Instatiate Storage and DOM managers
    const storageMaster = new StorageMaster("todos");
    const domMaster = new DomMaster(storageMaster,
        document.getElementById("project-info-div"), 
        document.getElementById("sub-tasks-div"), 
        document.getElementById("sidebar"), 
        document.getElementById("project-list"), 
        document.getElementById('close-btn'),
        document.getElementById("new-task-modal"),
        document.getElementById("new-task-form"),
        document.getElementById("project"));

        console.log(document.getElementById('new-task-modal'));

    // Project Modal eventListeners
    const newProjectBtn = document.getElementById('new-btn');
    const newProjectModal = document.getElementById('new-project-modal')
    const closeProjectModal = document.getElementById("close-project-modal");
    domMaster.closeBtn.addEventListener('click', () => {
        domMaster.clearMain();
    });

    newProjectBtn.addEventListener('mouseenter', () => {
        newProjectBtn.src = newWhite;
    });
    newProjectBtn.addEventListener('mouseleave', () => {
        newProjectBtn.src = newGreen;
    });
    newProjectBtn.addEventListener('click', () => {
        newProjectModal.showModal();
    });

    closeProjectModal.addEventListener('click', () => {
        newProjectModal.close();
    });

    // Process New Project Form
    const newProjectForm = document.getElementById('new-project-form');
    newProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        newProjectModal.close();
        
        // convert form data to new ListItem 
        const formData = new FormData(newProjectForm);
        const obj = Object.fromEntries(formData);

        const item = new ListItem({
            title: obj.projectTitle,
            description: obj.projectDescription,
            dueDate: obj.projectDueDate,
            priority: obj.projectPriority
        });

        // create new Project
        storageMaster.addItem(item);
        domMaster.refreshList(storageMaster.returnArray());
    });

    
    // Task Modal Event Listeners 
    const taskCloseBtn = document.getElementById("close-task-modal");
    taskCloseBtn.addEventListener('click', () => {
        domMaster.newTaskModal.close();
    });
    domMaster.newTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        domMaster.newTaskModal.close();

        const formData = new FormData(domMaster.newTaskForm);
        const obj = Object.fromEntries(formData);

        
        obj.id  = crypto.randomUUID();

        console.log(obj);

        storageMaster.addSubItem("id", obj.project, obj);

        domMaster.createMainCard(storageMaster.getItem("id", obj.project));
    });









    // execution


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

    console.log(domMaster.newTaskModal)

}
mainFuncton();