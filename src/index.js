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
        
        arr.splice(ind, 1);
        this.updateStorage(arr);
    }


    returnTodos() {
        return JSON.parse(localStorage.getItem(`${this.key}`));
    }

    firstTodo(item) {
        let arr = [];
        arr.push(item);

        this.updateStorage(arr);  
    }
}






// Execution
const storageMaster = new StorageMaster("todos");

storageMaster.firstTodo({
    title: "Study Piano",
    Description: "Work on scales"
});
storageMaster.addItem({
    title: "Paint",
    description: "Do a Caravaggio master copy"
});
console.log(storageMaster.returnTodos());
console.log(storageMaster.getItem("title", "Study Piano"));

console.log(storageMaster.removeItem("title", "Study Piano"));
console.log(storageMaster.returnTodos());