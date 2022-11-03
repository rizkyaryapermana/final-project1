const storageKey = "STORAGE_KEY";
const btnTambahkan = document.querySelector("#addToDoList");
const contentList = document.querySelector("#content-list");

function randomString(panjang) {
  var randomString = "";
  var characters = "1234567890";
  for (var i, i = 0; i < panjang; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return randomString;
}

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function addToStorage(data) {
  if (checkForStorage()) {
    let dataTodos = [];
    if (localStorage.getItem(storageKey) !== null) {
      dataTodos = JSON.parse(localStorage.getItem(storageKey));
    }

    dataTodos.unshift(data);
    if (dataTodos.length > 5) {
      dataTodos.pop();
    }

    localStorage.setItem(storageKey, JSON.stringify(dataTodos));
  }
}

function getData() {
  if (checkForStorage()) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

function renderData() {
  const getDataStorage = getData();

  contentList.innerHTML = " ";
  for (let todos of getDataStorage) {
    const divRow = document.createElement("div");
    divRow.setAttribute("class", "row task-row");
    const colCeklist = document.createElement("div");
    colCeklist.setAttribute("class", "col-md-1 col-2");
    const btnCeklist = document.createElement("button");
    btnCeklist.setAttribute("class", "btn-ceklist");
    btnCeklist.setAttribute("value", todos.id);
    const faCeklist = document.createElement("i");
    faCeklist.setAttribute("class", "fa fa-check");
    const colList = document.createElement("div");
    colList.setAttribute("class", "col-md-10 col-8");
    const textTask = document.createElement("div");
    todos.isComplete
      ? textTask.setAttribute("class", "text-task correct")
      : textTask.setAttribute("class", "text-task ");
    textTask.innerHTML = todos.content;
    const dateTask = document.createElement("span");
    dateTask.setAttribute("class", "date-task");
    const colDelete = document.createElement("div");
    colDelete.setAttribute("class", "col-md-1 col-2");
    const btnDelete = document.createElement("button");
    btnDelete.setAttribute("class", "btn-delete");
    btnDelete.setAttribute("value", todos.id);
    const faDelete = document.createElement("i");
    faDelete.setAttribute("class", "fa fa-trash");

    btnCeklist.appendChild(faCeklist);
    colCeklist.appendChild(btnCeklist);
    colList.appendChild(textTask);
    if (todos.date) {
      dateTask.innerHTML = todos.date;
      colList.appendChild(dateTask);
    }
    btnDelete.appendChild(faDelete);
    colDelete.appendChild(btnDelete);
    divRow.appendChild(colCeklist);
    divRow.appendChild(colList);
    divRow.appendChild(colDelete);
    contentList.appendChild(divRow);
  }
  document.querySelector("#titleToDoList").value = " ";
}

contentList.addEventListener("click", getButtonElemen);

function getButtonElemen(e) {
  e.preventDefault();
  if (e.target.classList.contains("btn-delete")) {
    if (confirm("Apakah yakin menhapus List ini ??")) {
      const elemen = e.target.parentElement;
      const elemenList = elemen.parentElement;
      removeList(elemen);
      elemenList.remove();
    }
  } else if (e.target.classList.contains("btn-ceklist")) {
    const elemen = e.target.parentElement;
    completeList(elemen);
  }
}

function completeList(elemen) {
  const list = getData();

  list.forEach((isi, index) => {
    if (elemen.firstChild.value === isi.id) {
      list.splice(index, 1, {
        id: isi.id,
        content: isi.content,
        date: isi.date,
        isComplete: true,
      });
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(list));
  renderData();
}

function removeList(elemen) {
  const list = getData();

  list.forEach((isi, index) => {
    if (elemen.firstChild.value === isi.id) {
      list.splice(index, 1);
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(list));
}

btnTambahkan.addEventListener("click", (e) => {
  e.preventDefault();
  const textList = document.querySelector("#titleToDoList").value;
  const dateList = document.querySelector("#dateToDoList").value;


  const newTodos = {
    id: randomString(5),
    content: textList,
    
    date: dateList,
    isComplete: false,
  };

  addToStorage(newTodos);
  renderData();
});

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      renderData();
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});