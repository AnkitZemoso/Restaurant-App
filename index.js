function Items(name, price, type, qty) {
  this.name = name;
  this.price = price;
  this.type = type;
  this.qty = qty;
}

sessionStorage.clear();

let ItemsList = [
  {
    Name: "Mutter Panner",
    Price: 250,
    Type: "paneer",
    Quantity: 1,
  },
  {
    Name: "Shahi Panner",
    Price: 350,
    Type: "paneer",
    Quantity: 1,
  },
  {
    Name: "Rasmalai",
    Price: 100,
    Type: "dessert",
    Quantity: 1,
  },
  {
    Name: "Ice Cream",
    Price: 150,
    Type: "dessert",
    Quantity: 1,
  },
  {
    Name: "Egg Omelete",
    Price: 150,
    Type: "starters",
    Quantity: 1,
  },
  {
    Name: "Chicken Noodles",
    Price: 200,
    Type: "starters",
    Quantity: 1,
  },
  {
    Name: "French Fries",
    Price: 50,
    Type: "extras",
    Quantity: 1,
  },
  {
    Name: "Butter Naan",
    Price: 100,
    Type: "paneer",
    Quantity: 1,
  },
  {
    Name: "Burger",
    Price: 200,
    Type: "extra",
    Quantity: 1,
  },
  {
    Name: "Cold Coffee",
    Price: 100,
    Type: "beverges",
    Quantity: 1,
  },
];

const menuItems = [];
for (let item of ItemsList) {
  menuItems.push(new Items(item.Name, item.Price, item.Type, item.Quantity));
}

console.log(menuItems);

// menuItems.push(new Items("Shahi Panner", 350, "paneer", 1));
// menuItems.push(new Items("Rasmalai", 100, "dessert", 1));
// menuItems.push(new Items("Ice Cream", 150, "dessert", 1));
// menuItems.push(new Items("Egg Omelete", 150, "starters", 1));
// menuItems.push(new Items("Chicken Noodles", 200, "starters", 1));
// menuItems.push(new Items("French Fries", 50, "extras", 1));
// menuItems.push(new Items("Butter Naan", 100, "extras", 1));
// menuItems.push(new Items("Burger", 200, "extras", 1));
// menuItems.push(new Items("Cold Coffee", 100, "beverages", 1));

let menu = "";
let mId = 1;
for (const item of menuItems) {
  menu =
    menu +
    '<div id ="' +
    mId +
    '" class="card items-drag" draggable="true" ><div class="card-body"><h3 class="card-title">' +
    item.name +
    '</h3><p class="card-text">' +
    item.price +
    "</p><br> </div></div>";
  mId += 1;
}

document.getElementById("items").innerHTML = menu;

function searchItems() {
  let input = document.getElementById("searchItem").value;
  input = input.toLowerCase();
  const cardContainer = document.getElementById("items");
  const cards = cardContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector(".card-body h3.card-title");

    if (
      title.innerHTML.toLowerCase().indexOf(input) > -1 ||
      menuItems[i].type.toLowerCase().indexOf(input) > -1
    ) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function searchTables() {
  let input = document.getElementById("searchTable").value;
  input = input.toLowerCase();
  console.log(input);
  const cardContainer = document.getElementById("table-names");
  console.log(cardContainer);
  const cards = cardContainer.getElementsByClassName("card");
  for (let i = 0; i < cards.length; i++) {
    let title = cards[i].querySelector(".card-body h3.card-title");
    if (title.innerHTML.toLowerCase().indexOf(input) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}

const itemsDraggable = document.querySelectorAll(".items-drag");
const all_tables = document.querySelectorAll(".drop-table");
let dragabbleItem = null;

itemsDraggable.forEach((item) => {
  item.addEventListener("dragstart", dragStart);
  item.addEventListener("dragend", dragEnd);
});
function dragStart() {
  dragabbleItem = this;
  console.log("drag start");
}
function dragEnd() {
  dragabbleItem = null;
  console.log("drag end");
}

all_tables.forEach((table) => {
  table.addEventListener("dragover", dragOver);
  table.addEventListener("dragenter", dragEnter);
  table.addEventListener("dragleave", dragLeave);
  table.addEventListener("drop", dragDrop);
});
function dragOver(e) {
  e.preventDefault();
  this.style.border = "1px dashed green";
}
function dragEnter() {
  this.style.border = "1px dashed green";
  console.log("drag enter");
}
function dragLeave() {
  this.style.border = "none";
  console.log("drag Leave");
}

function dragDrop() {
  this.style.border = "none";
  const spans = this.getElementsByTagName("span");
  const itemCost = dragabbleItem.getElementsByTagName("p");

  spans[1].innerHTML = Number(spans[1].innerHTML) + 1;
  spans[0].innerHTML =
    Number(spans[0].innerHTML) + Number(itemCost[0].innerHTML);

  var str = this.getElementsByTagName("h3")[0].innerHTML;
  var matches = str.match(/(\d+)/);

  console.log("str " + str);
  console.log(" matches " + matches);

  if (sessionStorage[matches[0]]) {
    let result = JSON.parse(sessionStorage.getItem(matches[0]));
    let flag = 1;
    for (let i = 0; i < result.length; i++) {
      let first = result[i][0];
      let quantity = result[i][1];
      if (first == dragabbleItem.id) {
        result[i][1] = quantity += 1;
        flag = 0;
        break;
      }
    }
    if (flag) {
      result.push([dragabbleItem.id, menuItems[dragabbleItem.id].qty]);
    }
    sessionStorage.setItem(matches[0], JSON.stringify(result));
  } else {
    sessionStorage.setItem(
      matches[0],
      JSON.stringify([[dragabbleItem.id, menuItems[dragabbleItem.id].qty]])
    );
  }
}

function openItems(tableId) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  let sNo = "<h5>S.No</h5>",
    itemName = "<h5>Item</h5>",
    itemPrice = "<h5>Price</h5>";
  let servings = "<h5>Number of servings</h5>";
  let deleteIcon = "<h5>Delete</h5>";
  var totalbill = 0;
  if (result.length == 0) {
    document.querySelector(".pop-up").style.display = "none";
    return;
  }
  for (let i = 0; i < result.length; i++) {
    let first = result[i][0];
    let quantity = result[i][1];
    let itemId = Number(first);
    let val = i + 1;
    totalbill += menuItems[itemId - 1].price * quantity;
    sNo += "<p>" + val + "</p>";
    itemName += "<p>" + menuItems[itemId - 1].name + "</p>";
    itemPrice += "<p>" + menuItems[itemId - 1].price + "</p>";
    servings +=
      "<input  type='number' name='" +
      tableId +
      "' value='" +
      quantity +
      "' size='1' onchange='increment(this," +
      itemId +
      "," +
      i +
      ")' /> ";
    deleteIcon +=
      "<p onclick='deleteItem(this, " +
      i +
      ", " +
      tableId +
      "," +
      quantity +
      "," +
      menuItems[itemId - 1].price +
      ")'  ><i class='fas fa-trash' ></i></p>";
  }
  let closeSession =
    "<button onclick='generateBill(" +
    tableId +
    ")' class='btn btn-primary'>Generate Bill</button>";

  document.getElementById("sno").innerHTML = sNo;
  document.getElementById("item-name").innerHTML = itemName;
  document.getElementById("item-price").innerHTML = itemPrice;
  document.getElementById("servings").innerHTML = servings;
  document.getElementById("total-bill").innerHTML = totalbill;
  document.getElementById("delete-icon").innerHTML = deleteIcon;
  document.getElementById("close-session").innerHTML = closeSession;
  document.querySelector(".pop-up").style.display = "flex";
  document.getElementById("total-bill").style.display = "none";
}

function openPopUp(id) {
  var str = id.getElementsByTagName("h3")[0].innerHTML;
  var matches = str.match(/(\d+)/);
  openItems(matches[0]);
}

function closePopUp(id) {
  document.querySelector(".pop-up").style.display = "none";
}

function deleteItem(id, index, tableId, qty, price) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  result.splice(index, 1);
  sessionStorage.setItem(tableId, JSON.stringify(result));
  billId = "tableBill-" + tableId;
  const tableName = document.getElementById(billId);
  const spans = tableName.getElementsByTagName("span");
  spans[1].innerHTML = Number(spans[1].innerHTML) - 1;
  spans[0].innerHTML = Number(spans[0].innerHTML) - qty * price;

  openItems(tableId);
}

function increment(id, itemId, index) {
  let serves = id.value;
  let result = JSON.parse(sessionStorage.getItem(id.name));
  result[index][1] = serves;
  sessionStorage.setItem(id.name, JSON.stringify(result));
  result = JSON.parse(sessionStorage.getItem(id.name));

  var totalbill = 0;
  for (let i = 0; i < result.length; i++) {
    let first = result[i][0];
    let quantity = result[i][1];
    let itemId = Number(first);
    totalbill += menuItems[itemId - 1].price * quantity;
  }

  document.getElementById("total-bill").innerHTML = totalbill;
}

function generateBill(tableId) {
  let result = JSON.parse(sessionStorage.getItem(tableId));
  let sNo = "<h5>S.No</h5>",
    itemName = "<h5>Item</h5>",
    itemPrice = "<h5>Price</h5>";
  let servings = "<h5>Number of servings</h5>";
  var totalbill = 0;
  for (let i = 0; i < result.length; i++) {
    let first = result[i][0];
    let quantity = result[i][1];
    let itemId = Number(first);
    let val = i + 1;
    totalbill += menuItems[itemId - 1].price * quantity;
    sNo += "<p>" + val + "</p>";
    itemName += "<p>" + menuItems[itemId - 1].name + "</p>";
    itemPrice += "<p>" + menuItems[itemId - 1].price + "</p>";
    servings += "<p>" + quantity + "</p>";
  }
  billId = "tableBill-" + tableId;
  const tableName = document.getElementById(billId);
  const spans = tableName.getElementsByTagName("span");
  spans[1].innerHTML = 0;
  spans[0].innerHTML = 0;
  sessionStorage.removeItem(tableId);
  document.getElementById("sno").innerHTML = sNo;
  document.getElementById("item-name").innerHTML = itemName;
  document.getElementById("item-price").innerHTML = itemPrice;
  document.getElementById("servings").innerHTML = servings;
  document.getElementById("total-bill").innerHTML = totalbill;
  document.getElementById("delete-icon").innerHTML = "";
  document.getElementById("close-session").innerHTML = "";
  document.getElementById("total-bill").style.display = "";
}
