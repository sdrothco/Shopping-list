
var localStorageLoadComplete = false;

$(document).ready(function() {

	// Load any saved data from local storage.
	loadFromLocalStorage();
	localStorageLoadComplete = true;


	// A favorite list item was checked or unchecked
	$('.favorites-check-list').on('click', '.checkbox, .item-text', function(event) {
		$(this).closest('li').toggleClass('checked');
		checkForAllSelectedOrDeselected($('.favorites'));
		event.preventDefault();
	});


	// Behavior just for the shopping list: highlighting on hover, checkboxes, favoriting.
	$('.shopping-check-list').on('mouseenter', 'li', function() {
		$(this).addClass('highlighted');
	})
	// These are separate functions instead of combined w/ toggling because the behavior was
	// wonky when they were combined.
	.on('mouseleave', 'li', function() {
		$(this).removeClass('highlighted');

	})
	// Clicked the checkbox or the text.
	.on('click', '.checkbox, .item-text', function(event) {
		$(this).closest('li').toggleClass('checked');
		checkForAllSelectedOrDeselected($('.shopping-list'));
		event.preventDefault();
	})
	// Favorited existing item
	.on('click', '.icon-star2', function (event) {
		var $parentLi = $(this).closest('li');
		addNewFavorite($parentLi.find('.item-text').text());
		event.preventDefault();
    });


	// Do editing and removal 
	$('.shopping-check-list, .favorites-check-list').on('click', '.icon-pencil', function (event) {
		var $editShowing = $('.edit-item:visible'),
			$newEditItem = $(this).closest('li').find('.edit-item');

		// if there's already an edit box open, close it
		if($editShowing.length > 0 || $editShowing.is($newEditItem) ) {
			//console.log("closing already open edit box - reset to >" + $editShowing.next('.item-text').text());
			$editShowing.toggle().next('.item-text').toggle();
			$editShowing.val($editShowing.next('.item-text').text());
		}
		else {
			$newEditItem.toggle().focus().next('.item-text').toggle();
		}
		event.preventDefault();
    })
    .on('click', '.icon-remove', function (event) {
		var $parentUL = $(this).closest('ul');
		$(this).closest('li').remove();
		if (localStorageLoadComplete) {
			writeToLocalStorage($parentUL);
		}
		event.preventDefault();
    })
    .on('keyup', '.edit-item', function(event) {
        if (event.keyCode == 13) {
            editItem($(this));
         }
		event.preventDefault();
    });

    ///////////////////////
    // Add item controls
    //
    $('#add-item-form').on('click', '.add-favorite-button', function(event) {
		$(this).toggleClass('selected');
		event.preventDefault();
    });
	$('#add-item-form').on('keypress', '#add-item', function(event) {
        if (event.keyCode == 13) {
			var isFavorite = $('.add-favorite-button').hasClass('selected');
            addShoppingListItem($(this).val());
			// if the favorite button is pressed down, add this item as a favorite too.
            if (isFavorite) {
				addNewFavorite($(this).val());
			}
            $(this).val('');
         }
		//event.preventDefault();
    });
    $('.add-button').on('click', function(event) {
		var $addItemTextField = $('#add-item'),
		isFavorite = $('.add-favorite-button').hasClass('selected');

        addShoppingListItem($addItemTextField.val());
        // if the favorite button is pressed down, add this item as a favorite too.
        if (isFavorite) {
			addNewFavorite($addItemTextField.val());
		}
        $addItemTextField.val('');
		event.preventDefault();
    });


	// Provides behavior for both select all buttons
    $('.select-all-button').on('click', function(event) {
		var $parentSection = $(this).closest('section'),
			// find all the list items that are unchecked
			theLis = $parentSection.find('li:not(.checked)');

		if( theLis.length > 0 ) {
			$(this).hide();
			$parentSection.find('.deselect-all-button').show();

			theLis.addClass('checked');
		}
		event.preventDefault();
	});


	// Provides behavior for both deselect all buttons
	$('.deselect-all-button').on('click', function(event) {
		var $parentSection = $(this).closest('section'),
			// find all the list items that are checked
			theLis = $parentSection.find('li.checked');

		if( theLis.length > 0 ) {
			$(this).hide();
			$parentSection.find('.select-all-button').show();
	
			theLis.removeClass('checked');

		}
		event.preventDefault();
	});


	// Provides behavior for both delete selected buttons
	$('.delete-selected-button').on('click', function(event) {
		console.log('deleting selected');
		var $parentSection = $(this).closest('section'),
			$parentUL = $parentSection.find('ul'),
			$liToRemove = $parentSection.find('li.checked');
		
		$liToRemove.remove();
		if (localStorageLoadComplete) {
			writeToLocalStorage($parentUL);
		}

		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
		event.preventDefault();
	});


	// Adds the selected favorites to the shopping list.
	$('.add-to-list-button').on('click', function(event) {
		//console.log('adding favorites to shopping list');
		var $parentSection = $(this).closest('section'),
			$lisToAdd = $parentSection.find('li.checked');
		
		$lisToAdd.each( function(index) {
			var $thisLiToAdd = $(this),
				favoriteTextStr = $thisLiToAdd.find('.item-text').text();

			//console.log("add-to-list-button: thisLiToAdd.text is >" +favoriteTextStr+ "<");
			addShoppingListItem(favoriteTextStr);
			$thisLiToAdd.toggleClass('checked');
		});

		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
		event.preventDefault();
	});

	// Delete any saved data from local storage.
	$('.reset-saved-data-button').on('click', function() {
		console.log('Resetting saved data');
		window.localStorage.clear();
		location.reload();
	});
});

// Looks to see if there is any data in local storage, and if there is...
// it loads it into the DOM.
function loadFromLocalStorage() {

	var loadedData = false;
	if (typeof(window.localStorage)!=="undefined") {

		var favList = JSON.parse(window.localStorage.getItem('favoritesCheckList')),
			shopList = JSON.parse(window.localStorage.getItem('shoppingCheckList'));

		if (favList && favList.length > 0) {
			console.log("Found favorites list: Loading now.");
			$('.favorites-check-list li').remove();
			var favLength = favList.length;
			for (var i = 0; i < favLength; i++) {
				console.log("Loading favorite: >" + favList[i] + "<");
				addNewFavorite(favList[i]);
			}
			loadedData = true;
		}
		else {
			console.log("Did NOT find favorites list: Use file data.");
		}

		if (shopList && shopList.length > 0) {
			console.log("Found shopping list: Loading now.");
			$('.shopping-check-list li').remove();
			var shopLength = shopList.length;
			for (var j = 0; j < shopLength; j++) {
				console.log("Loading shop list item: >" + shopList[j] + "<");
				addShoppingListItem(shopList[j]);
			}
			loadedData = true;
		}
		else {
			console.log("Did NOT find shopping list: Use file data.");
		}
	}
	else {
		console.log("loadFromLocalStorage: Local storage not available.");
		$('.reset-saved-data-button').hide();
	}

	if (loadedData) {
		$('.saved-data-load-msg').show();
		$('.default-load-msg').hide();
	}
	else {
		$('.saved-data-load-msg').hide();
		$('.default-load-msg').show();
	}

}

// If the user added, deleted, or modified any list items, write the
// data to local storage.
function writeToLocalStorage($parentUL) {

	if (typeof(window.localStorage)!=="undefined") {

		//console.log("writeToLocalStorage: parentUL class =>" +$parentUL.attr('class')+ "<");
		var fav = $parentUL.find('li .item-text'),
			arr = fav.map(function () { return $(this).text(); }).get();

		if ($parentUL.hasClass('favorites-check-list')) {
			console.log("Saving Favorites list to local storage.");
			window.localStorage.setItem('favoritesCheckList', JSON.stringify(arr));
		}
		else {
			console.log("Saving shopping list to local storage.");
			window.localStorage.setItem('shoppingCheckList', JSON.stringify(arr));
		}
	}
	else {
		console.log("writeToLocalStorage: Local storage not available.");
	}
	$('.saved-data-load-msg').hide();
	$('.default-load-msg').hide();
}


// Add a new shopping list item
function addShoppingListItem(textFieldVal) {
	textFieldVal = $.trim(textFieldVal);
	//console.log("In Add: trimmed val >" +textFieldVal+ "<");
    
    if( textFieldVal !== '' ) {
	
		// if the item already exists in the shopping list, throw an error.
		var theMatches = $('.shopping-check-list li .item-text').filter( function (index) {
				//console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == textFieldVal;
			});
		if( theMatches.length > 0 ) {
			alert("Error: That item already exists in the shopping list.");
			return;
		}

		var $parentUL = $('.shopping-check-list'),
			$newItem = $('<li><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
				+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
				+' <input class="edit-item" type="text" value="'+textFieldVal+'"><span class="item-text">'
				+textFieldVal+ '</span><span class="item-controls">'
				+'<a href="#" data-icon="&#xe606;" class="icon-star2"></a><a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		$parentUL.append($newItem);
		if (localStorageLoadComplete) {
			writeToLocalStorage($parentUL);
		}
	}
	else {
		alert("Please enter an item to add to the list.");
	}
}


// Add a new item to the favorites list.
function addNewFavorite(favoriteStr) {

	favoriteStr = $.trim(favoriteStr);
    if( favoriteStr !== '' ) {
		// if the item already exists in the favorites list, throw an error.
		var theMatches = $('.favorites-check-list li .item-text').filter( function (index) {
				//console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == favoriteStr;
			});
		if( theMatches.length > 0 ) {
			alert("Error: That item already exists in the favorites list.");
			return;
		}

		var $parentUL = $('.favorites-check-list'),
			$newItem = $('<li><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
				+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
				+' <input class="edit-item" type="text" value="'+favoriteStr+'"><span class="item-text">'
				+favoriteStr+ '</span><span class="fav-controls">'
				+'<a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		$parentUL.append($newItem);
		if (localStorageLoadComplete) {
			writeToLocalStorage($parentUL);
		}
	}
}


// Edit a list item, either shopping list or favorite.
function editItem ($textField) {
	var	textFieldVal = $.trim($textField.val()),
		$liToEdit = $textField.closest('li');

	if( textFieldVal !== '' ) {
	var currentItemText = $liToEdit.find('.item-text').text();

		console.log("Edit: textFieldVal >" +textFieldVal + "<, currentItemText >" +currentItemText+ "<");
		if( textFieldVal !== '' && textFieldVal !== currentItemText ) {

			$liToEdit.find('.item-text').text(textFieldVal);
			writeToLocalStorage($liToEdit.closest('ul'));
			$liToEdit.find('.icon-pencil').click();
		}
	}
	else {
		alert("Please enter a new value.");
	}
}


// Check for the situation where the user manually selects or deselects all 
// the checkboxes.  If that happens, appropriately hide and show the buttons
// so that they are usable.
function checkForAllSelectedOrDeselected($parentSection) {
	var theUncheckedLis = $parentSection.find('li:not(.checked)'),
		theCheckedLis = $parentSection.find('.checked');

	// if there are no unchecked items, hide select all, show deselect all
	if (theUncheckedLis.length === 0) {
		$parentSection.find('.select-all-button').hide();
		$parentSection.find('.deselect-all-button').show();
	}
	// if there are no checked items, hide deselect all, show select all
	if (theCheckedLis.length === 0) {
		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
	}
}
