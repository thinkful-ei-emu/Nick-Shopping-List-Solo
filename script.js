/* global cuid */
'use strict';


const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false},
    {id: cuid(), name: 'oranges', checked: false},
    {id: cuid(), name: 'milk', checked: true},
    {id: cuid(), name: 'bread', checked: false}
  ],
  hideCompleted: false,
};


function generateItemElement(item) {
  return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {

  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join('');
}

function searchHandler(){
  $('#js-search-form').submit(event => {
    event.preventDefault();
    let searchTerm = $('.js-search-form').val();
    let searchResult = [];
    for (let i = 0; i < STORE.items.length; i++){
      if (searchTerm === STORE.items[i].name){
        searchResult.push(searchTerm);
      }
    }
    let searchResultString = searchResult.join('');
  });
}
  


function renderShoppingList() {
  // render the shopping list in the DOM
  let filteredItems = STORE.items;
  if (STORE.hideCompleted){
    filteredItems = filteredItems.filter(item => !item.checked);
  }
  const shoppingListItemsString = generateShoppingItemsString(filteredItems);
    
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  STORE.items.push({id: cuid(), name: itemName, checked:false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}


function toggleCheckedForListItem(itemId){
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item){
  return $(item).closest('li').data('item-id');
}

function handleItemCheckClicked() {
  // this function will be responsible for when users click the "check" button on
  // a shopping list item.
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemId = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}

function deleteItem(itemId){
  const item = STORE.items.find(item => item.id === itemId);
  const itemIndex = STORE.items.indexOf(item);
  STORE.items.splice(itemIndex, 1);
    
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemId = getItemIdFromElement(event.currentTarget);
    deleteItem(itemId);
    renderShoppingList();
  });
}

function toggleHideFilter(){
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleHideFilter(){
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}




// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  searchHandler();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
