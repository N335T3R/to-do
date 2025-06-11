import './styles.css';
import newWhite from './assets/images/new-white.png';
import newGreen from './assets/images/new_green.png';
import trash from './assets/images/trash-white.png';
import trashGreen from './assets/images/trash-green.png';
import trashBlack from './assets/images/trash-black.png';
// Find a way to wrap this in a MAIN FUNCTION

function dateMonthDD(date) {
	const arr = [...date];

	arr.forEach(char => {
		if (char === '-') {
			arr.splice(arr.indexOf(char), 1);
		}
	});

	const month = arr.slice(4, 6).join('');

	const obj = {
		year: arr.slice(0, 4).join(''),
		day: arr.slice(6, arr.length).join(''),
	};

	switch (month) {
		case '01':
			obj.month = 'JAN';
			break;
		case '02':
			obj.month = 'FEB';
			break;
		case '03':
			obj.month = 'MAR';
			break;
		case '04':
			obj.month = 'APR';
			break;
		case '05':
			obj.month = 'MAY';
			break;
		case '06':
			obj.month = 'JUN';
			break;
		case '07':
			obj.month = 'JUL';
			break;
		case '08':
			obj.month = 'AUG';
			break;
		case '09':
			obj.month = 'SEP';
			break;
		case '10':
			obj.month = 'OCT';
			break;
		case '11':
			obj.month = 'NOV';
			break;
		case '12':
			obj.month = 'DEC';
			break;
	}

	return obj;
}

class ListItem {
	constructor({title, description, dueDate}) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
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
		const arr = JSON.parse(localStorage.getItem(`${this.key}`));
		// Search todos for item
		return arr.find(todo => todo[key] === value);
		// Return item
	}

	addItem(item) {
		const arr = JSON.parse(localStorage.getItem(`${this.key}`));

		arr.push(item);
		this.updateStorage(arr);
	}

	removeItem(key, value) {
		const arr = JSON.parse(localStorage.getItem(`${this.key}`));
		const ind = arr.indexOf(arr.find(todo => todo[key] === value));

		if (ind !== -1) {
			arr.splice(ind, 1);
			this.updateStorage(arr);
		}
	}

	// GetSubItem() {}

	// Needs tested
	removeSubItem(key, value, subKey, subValue) {
		// Get item
		const arr = JSON.parse(localStorage.getItem(`${this.key}`));
		const item = arr.find(todo => todo[key] === value);
		// Get subItem index
		const itemArr = item.items;
		const ind = itemArr.indexOf(itemArr.find(subItem => subItem[subKey] === subValue));

		if (ind !== -1) {
			itemArr.splice(ind, 1);
			this.updateStorage(arr);
		}
	}

	addSubItem(key, value, subItem) {
		const item = this.getItem(key, value);

		if (item.items) {
			this.removeItem(key, value);
			item.items.push(subItem);
			this.addItem(item);
		} else {
			this.removeItem(key, value);
			item.items = [];
			item.items.push(subItem);
			this.addItem(item);
		}

		const arr = JSON.parse(localStorage.getItem(`${this.key}`));
		this.updateStorage(arr);
		console.log(this.returnArray());
	}

	returnArray() {
		return JSON.parse(localStorage.getItem(`${this.key}`));
	}

	firstTodo(item) {
		const arr = [];
		arr.push(item);

		this.updateStorage(arr);
	}
}

class DomMaster {
	constructor(
		storage,
		main = null,
		subMain = null,
		sidebar = null,
		list = null,
		newTaskModal = null,
		newTaskForm = null,
		taskProject,
	) {
		this.storage = storage;
		this.main = main;
		this.mainContent = main.innerHTML;
		this.subMain = subMain;
		this.sidebar = sidebar;
		this.list = list;
		this.newTaskModal = newTaskModal;
		this.newTaskForm = newTaskForm;
		this.taskProject = taskProject;
		// Cans refreshed in refreshList()
		this.cans = [];
		// SubCans refreshed in clearMain()
		this.subCans = [];
	}

	clearMain() {
		this.main.innerHTML = '';
		this.subMain.innerHTML = '';
		this.subCans = [];
	}

	restoreMain() {
		this.main.innerHTML = this.mainContent;
	}

	// Used in ?
	refreshTasks(item) {
		this.subMain.innerHTML = '';

		const taskHeader = document.createElement('div');
		taskHeader.classList.add('sub-tasks-header');
		this.subMain.appendChild(taskHeader);

		const h = document.createElement('h2');
		h.textContent = 'Tasks';
		taskHeader.appendChild(h);

		const newTaskBtn = document.createElement('img');
		newTaskBtn.classList.add('new-task-btn');
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
			this.taskProject.value = `${item.id}`;
		});
	}

	// Passing item passes the item as it was when
	// the eventListener in createLi was applied
	createMainCard(item) {
		this.clearMain();
		this.refreshTasks(item);

		// Replace item with most updated version
		// by getting item directly from storage
		item = this.storage.getItem('id', `${item.id}`);
		// Create Card
		const title = document.createElement('h1');
		const description = document.createElement('p');
		const wrapper = document.createElement('div');
		wrapper.classList.add('project-wrapper');

		// Date
		const dateWrapper = document.createElement('div');
		dateWrapper.classList.add('date-wrapper');
		const date = dateMonthDD(item.dueDate);
		const month = document.createElement('h3');
		month.classList.add('month');
		month.textContent = date.month;
		const day = document.createElement('p');
		day.classList.add('day');
		day.textContent = date.day;
		const year = document.createElement('h4');
		year.classList.add('year');
		year.textContent = date.year;

		dateWrapper.appendChild(day);
		dateWrapper.appendChild(month);
		dateWrapper.appendChild(year);

		// TextContent and appendations
		title.textContent = item.title;
		description.textContent = item.description;
		date.textContent = item.dueDate;

		this.main.appendChild(title);
		wrapper.appendChild(description);
		wrapper.appendChild(dateWrapper);

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
		wrapper.classList.add('task-wrapper');
		const subCan = new Image();
		subCan.src = trashBlack;

		const dateWrapper = document.createElement('div');
		dateWrapper.classList.add('date-wrapper');
		const date = dateMonthDD(subItem.dueDate);
		const month = document.createElement('h3');
		month.classList.add('month');
		month.textContent = date.month;
		const day = document.createElement('p');
		day.classList.add('day');
		day.textContent = date.day;
		const year = document.createElement('h4');
		year.classList.add('year');
		year.textContent = date.year;

		dateWrapper.appendChild(day);
		dateWrapper.appendChild(month);
		dateWrapper.appendChild(year);

		// Set text-content
		title.textContent = subItem.title;
		description.textContent = subItem.description;

		// Appendations
		wrapper.appendChild(title);
		wrapper.appendChild(description);
		wrapper.appendChild(dateWrapper);
		this.subMain.appendChild(wrapper);

		// Trash can code
		this.subCans.push(subCan);
		subCan.classList.add('subcan');
		wrapper.appendChild(subCan);

		// AddEventListener to trash can to {
		// domMaster.removeSubItem(item, subItem);
		//  ^^ OR ^^ (key, value, key, value);
		// this.refreshTasks(item);
		// }
		subCan.addEventListener('mouseenter', () => {
			subCan.src = trash;
		});
		subCan.addEventListener('mouseleave', () => {
			subCan.src = trashBlack;
		});
		subCan.addEventListener('click', () => {
			// Code for can
			this.storage.removeSubItem('id', item.id, 'id', subItem.id);
			this.createMainCard(item);
		});
	}

	// Used in refreshList()
	clearList() {
		this.list.innerHTML = '';
	}

	// Unsure if used
	listAppend(title, id) {
		// Data-id require for click event to send to-do
		// to StorageMaster to find To-Do
		const li = document.createElement('li');

		li.classList.add('project-list-item');
		li.textContent = title;
		li.setAttribute('data-id', id);

		this.list.appendChild(li);
	}

	// Used in this.refreshList()
	createLi(item) {
		const li = document.createElement('li');

		li.classList.add('project-list-item');
		li.setAttribute('data-id', item.id);
		li.textContent = item.title;

		li.addEventListener('click', () => {
			this.createMainCard(item);

			// pass menuBtn through during constructor
			this.sidebar.classList.toggle('visible');
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
			const li = this.createLi(item);
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
				this.storage.removeItem('id', can.li.dataset.id);
				this.refreshList(this.storage.returnArray());
			});
		});

		this.clearMain();
	}
}

// Execution
function mainFunction() {
	// Menu button eventListener for Mobile
	const menuBtn = document.getElementById('menu-btn');
	menuBtn.addEventListener('click', () => {
		document.getElementById('sidebar').classList.toggle('visible');
	});

	// Instatiate Storage and DOM managers
	const storageMaster = new StorageMaster('todos');
	const domMaster = new DomMaster(
		storageMaster,
		document.getElementById('project-info-div'),
		document.getElementById('sub-tasks-div'),
		document.getElementById('sidebar'),
		document.getElementById('project-list'),
		document.getElementById('new-task-modal'),
		document.getElementById('new-task-form'),
		document.getElementById('project'),
	);

	console.log(document.getElementById('new-task-modal'));


	// Project Modal eventListeners
	const newProjectBtn = document.getElementById('new-btn');
	const newProjectModal = document.getElementById('new-project-modal');
	const closeProjectModal = document.getElementById('close-project-modal');


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
	newProjectForm.addEventListener('submit', e => {
		e.preventDefault();
		newProjectModal.close();

		// Convert form data to new ListItem
		const formData = new FormData(newProjectForm);
		const obj = Object.fromEntries(formData);

		const item = new ListItem({
			title: obj.projectTitle,
			description: obj.projectDescription,
			dueDate: obj.projectDueDate,
		});

		// Create new Project
		storageMaster.addItem(item);
		domMaster.refreshList(storageMaster.returnArray());
	});

	// Task Modal Event Listeners
	const taskCloseBtn = document.getElementById('close-task-modal');
	taskCloseBtn.addEventListener('click', () => {
		domMaster.newTaskModal.close();
	});
	domMaster.newTaskForm.addEventListener('submit', e => {
		e.preventDefault();
		domMaster.newTaskModal.close();

		const formData = new FormData(domMaster.newTaskForm);
		const obj = Object.fromEntries(formData);

		obj.id = crypto.randomUUID();

		console.log(obj);

		domMaster.storage.addSubItem('id', obj.project, obj);
		domMaster.createMainCard(storageMaster.getItem('id', obj.project));
	});

	// Execution

	storageMaster.firstTodo(new ListItem({
		title: 'Study Piano',
		description: 'Work on scales',
		dueDate: '2025-07-31',
	}));
	storageMaster.addItem(new ListItem({
		title: 'Paint',
		description: 'Do a Caravaggio master copy',
		dueDate: '2025-05-29',
	}));
	storageMaster.addSubItem('title', 'Paint', {
		title: 'Sketch design',
		description: 'Paintings don\'t compose themselves',
		dueDate: '2025-05-29',
	});

	console.log(storageMaster.returnArray());
	domMaster.refreshList(storageMaster.returnArray());
	domMaster.createMainCard(storageMaster.getItem('title', 'Paint'));

	console.log(domMaster.newTaskModal);
}

mainFunction();
