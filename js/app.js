

$(document).ready(function() {

	// A favorite list item was checked or unchecked
	$('.favorites-check-list').on('click', '.checkbox, .item-text', function() {
		$(this).closest("li").toggleClass("checked");

		checkForAllSelectedOrDeselected($('.favorites'));
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
	.on('click', '.checkbox, .item-text', function() {
		$(this).closest("li").toggleClass("checked");
		checkForAllSelectedOrDeselected($('.shopping-list'));

	})
	// Favorited existing item
	.on('click', '.icon-star2', function () {

		var $parentLi = $(this).closest("li");
		addNewFavorite($parentLi.find(".item-text").text());
    });


	// Do editing and removal 
	$('.shopping-check-list, .favorites-check-list').on('click', '.icon-pencil', function () {
		console.log("editing item");

		var $editShowing = $('.edit-item:visible');
		var $newEditItem = $(this).closest("li").find(".edit-item");

		// if there's already an edit box open, close it
		if($editShowing.length > 0 || $editShowing.is($newEditItem) ) {
			console.log("closing already open edit box - reset to >" + $editShowing.next('.item-text').text());

			$editShowing.toggle().next('.item-text').toggle();
			$editShowing.val($editShowing.next('.item-text').text());
		}
		else {
			$newEditItem.toggle().focus().next('.item-text').toggle();
		}
    })
    .on('click', '.icon-remove', function () {
		$(this).closest("li").remove();
    })
    .on('keyup', '.edit-item', function(event) {
        if (event.keyCode == 13) {
            editItem($(this));
         }
    });

    
    // FORM CONTROLS
    $('#add-item-form').on('click', '.add-favorite-button', function() {
		$(this).toggleClass("selected");
    });
	$('#add-item').on('keyup', function(event) {
        if (event.keyCode == 13) {
			var isFavorite = $('.add-favorite-button').hasClass('selected');
            addShoppingListItem($(this).val());
			// if the favorite button is pressed down, add this item as a favorite too.
            if (isFavorite) {
				addNewFavorite($(this).val());
			}
            $(this).val('');
         }
    });
    $('.add-button').on('click', function() {
		var $addItemTextField = $('#add-item');
        var isFavorite = $('.add-favorite-button').hasClass('selected');

        addShoppingListItem($addItemTextField.val());
        // if the favorite button is pressed down, add this item as a favorite too.
        if (isFavorite) {
			addNewFavorite($addItemTextField.val());
		}
        $addItemTextField.val('');
    });


	// Provides behavior for both select all buttons
    $('.select-all-button').on('click', function() {
		var $parentSection = $(this).closest("section");

		// find all the list items that are unchecked
		var theLis = $parentSection.find("li:not(.checked)");
		if( theLis.length > 0 ) {
			$(this).hide();
			$parentSection.find('.deselect-all-button').show();

			theLis.addClass("checked");
		}
	});


	// Provides behavior for both deselect all buttons
	$('.deselect-all-button').on('click', function() {
		var $parentSection = $(this).closest("section");

		// find all the list items that are checked
		var theLis = $parentSection.find("li.checked");
		if( theLis.length > 0 ) {
			$(this).hide();
			$parentSection.find('.select-all-button').show();
	
			theLis.removeClass("checked");
		}
	});


	// Provides behavior for both delete selected buttons
	$('.delete-selected-button').on('click', function() {
		console.log('deleting selected');
		var $parentSection = $(this).closest("section");
		var $liToRemove = $parentSection.find("li.checked");
		
		$liToRemove.remove();

		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
	});


	// Adds the selected favorites to the shopping list.
	$('.add-to-list-button').on('click', function() {
		console.log('adding favorites to shopping list');
		var $parentSection = $(this).closest("section");
		var $lisToAdd = $parentSection.find("li.checked");
		
		$lisToAdd.each( function(index) {
			var $thisLiToAdd = $(this);
			var favoriteTextStr = $thisLiToAdd.find('.item-text').text();

			console.log("add-to-list-button: thisLiToAdd.text is >" +favoriteTextStr+ "<");
			addShoppingListItem(favoriteTextStr);
			$thisLiToAdd.toggleClass("checked");
		});

		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
	});

});


// Add a new shopping list item
function addShoppingListItem(textFieldVal) {
	textFieldVal = $.trim(textFieldVal);
	console.log("In Add: trimmed val >" +textFieldVal+ "<");
    
    if( textFieldVal !== '' ) {
	
		// if the item already exists in the shopping list, throw an error.
		var theMatches = $('.shopping-check-list li .item-text').filter( function (index) {
				console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == textFieldVal;
			});
		if( theMatches.length > 0 ) {
			alert("Error: That item already exists in the shopping list.");
			return;
		}

		var newItem = $('<li><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
			+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
			+' <input class="edit-item" type="text" value="'+textFieldVal+'"><span class="item-text">'
			+textFieldVal+ '</span><span class="item-controls">'
			+'<a href="#" data-icon="&#xe606;" class="icon-star2"></a><a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		console.log(textFieldVal);
		$('.shopping-check-list').append(newItem);
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
				console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == favoriteStr;
			});
		if( theMatches.length > 0 ) {
			alert("Error: That item already exists in the favorites list.");
			return;
		}

		var newItem = $('<li><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
			+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
			+' <input class="edit-item" type="text" value="'+favoriteStr+'"><span class="item-text">'
			+favoriteStr+ '</span><span class="fav-controls">'
			+'<a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		console.log(favoriteStr);
		$('.favorites-check-list').append(newItem);
	}

}


// Edit a list item, either shopping list or favorite.
function editItem ($textField) {
	var	textFieldVal = $.trim($textField.val());

	if( textFieldVal !== '' ) {
	var $liToEdit = $textField.closest("li");
	var currentItemText = $liToEdit.find('.item-text').text();

		console.log("Edit: textFieldVal >" +textFieldVal + "<, currentItemText >" +currentItemText+ "<");

		if( textFieldVal !== '' && textFieldVal !== currentItemText ) {

			$liToEdit.find('.item-text').text(textFieldVal);
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
	var theUncheckedLis = $parentSection.find("li:not(.checked)");
	var theCheckedLis = $parentSection.find(".checked");

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
