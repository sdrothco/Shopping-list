

$(document).ready(function() {

	// A favorite list item was checked or unchecked
	$('.favorites-check-list').on('click', '.checkbox, .item-text', function() {
		doFavoriteListToggle($(this).closest("li"));

		checkForAllSelectedOrDeselected($('.favorites'));
	});


	// Behavior just for the shopping list: highlighting on hover, checkboxes, favoriting.
	$('.shopping-check-list').on('mouseenter', 'li', function() {
		$(this).addClass('highlighted');
	})
	.on('mouseleave', 'li', function() {
		$(this).removeClass('highlighted');

	})
	.on('click', '.checkbox, .item-text', function() {
		$(this).closest("li").toggleClass("checked");
		checkForAllSelectedOrDeselected($('.shopping-list'));

	})
	.on('click', '.icon-star2', function () {
		var $parentLi = $(this).closest("li");
		addNewFavorite($parentLi.find(".item-text").text());
		$parentLi.addClass('is-favorite');
    });


	// Do editing and removal the same for both lists.
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
            addShoppingListItem($(this).val(), isFavorite);
            if (isFavorite) {
				addNewFavorite($(this).val());
			}
            $(this).val('');
         }
    });
    $('.add-button').on('click', function() {
		var $addItemTextField = $('#add-item');
        var isFavorite = $('.add-favorite-button').hasClass('selected');

        addShoppingListItem($addItemTextField.val(), isFavorite);
        if (isFavorite) {
			addNewFavorite($addItemTextField.val());
		}
        $addItemTextField.val('');
    });


	// Provides behavior for both select all buttons
    $('.select-all-button').on('click', function() {
		var $parentSection = $(this).closest("section");
		var isFavoritesButton = $parentSection.hasClass("favorites");
		var theLis = $parentSection.find("li:not(.checked)");

		if( theLis.length > 0 ) {
			//theLis.addClass("checked");
			$(this).hide();
			$parentSection.find('.deselect-all-button').show();
			if (isFavoritesButton) {
				//theLis.find('.checkbox').click();
				theLis.each(function() {
					console.log("Select all--iterating over lis:" + $(this).find('.item-text').text() );
					doFavoriteListToggle($(this));
				});
			}
			else theLis.addClass("checked");
		}
	});

	// Provides behavior for both deselect all buttons
	$('.deselect-all-button').on('click', function() {
		var $parentSection = $(this).closest("section");
		var isFavorites = $parentSection.hasClass("favorites");
		var theLis = $parentSection.find("li.checked");

		//theLis.removeClass("checked");
		$(this).hide();
		$parentSection.find('.select-all-button').show();
		if (isFavorites) {
				//theLis.find('.checkbox').click();
				theLis.each(function() {
					console.log("Deselect all--iterating over lis:" + $(this).find('.item-text').text() );
					doFavoriteListToggle($(this));
				});
		}
		else theLis.removeClass("checked");
	});

	// Provides behavior for both delete selected buttons
	$('.delete-selected-button').on('click', function() {
		console.log('deleting selected');
		var $parentSection = $(this).closest("section");

		var liToRemove = $parentSection.find("li.checked");
		// if deleted favorites, check for shopping list items that 
		// shouldn't have a yellow star anymore.
		if( $parentSection.hasClass('favorites')) {

			// for each favorite li to be removed...unhighlight the yellow star for the equiv shop list item.
			liToRemove.each( function(index) {
				var $thisLiToRemove = $(this);
				console.log("Delete selected: liToRemove.text is >" +$thisLiToRemove.find('.item-text').text()+ "<");
				var theMatches = $('.shopping-check-list li.is-favorite .item-text').filter( function (index) {
						console.log("Delete selected: in filter, text is >" +$(this).text()+ "<");
						return $(this).text() == $thisLiToRemove.find('.item-text').text();
					});
				console.log("Delete selected: theMatches.text is >" +theMatches.text()+ "<");
				theMatches.closest('li').removeClass('is-favorite');
			});
		}
		liToRemove.remove();

		$parentSection.find('.deselect-all-button').hide();
		$parentSection.find('.select-all-button').show();
	});

});



function addShoppingListItem(textFieldVal, isFavorite) {
	textFieldVal = $.trim(textFieldVal);
	console.log("In Add: trimmed val >" +textFieldVal+ "<, isFavorite=" + isFavorite);
    
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

		var isFavClassStr = "";
		if (isFavorite) {
			isFavClassStr = " class='is-favorite'";
		}
		var newItem = $('<li' +isFavClassStr+ '><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
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

function editItem ($textField) {
	var	textFieldVal = $.trim($textField.val());
	if( textFieldVal !== '' ) {
		console.log("Edit: " +textFieldVal);
		$textField.closest("li").find('.item-text').text(textFieldVal);
		$textField.closest("li").find('.icon-pencil').click();
	}
}

function addNewFavorite(favoriteStr) {

	favoriteStr = $.trim(favoriteStr);
    if( textFieldVal !== '' ) {
		// if the item already exists in the favorites list, throw an error.
		var theMatches = $('.favorites-check-list li .item-text').filter( function (index) {
				console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == favoriteStr;
			});
		if( theMatches.length > 0 ) {
			alert("Error: That item already exists in the favorites list.");
			return;
		}

		var newItem = $('<li class="checked"><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
			+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
			+' <input class="edit-item" type="text" value="'+favoriteStr+'"><span class="item-text">'
			+favoriteStr+ '</span><span class="fav-controls">'
			+'<a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		console.log(favoriteStr);
		$('.favorites-check-list').append(newItem);
	}

}

// If they check a favorite, it should be added to the shopping list.
// It they uncheck a favorite, it should be removed from the shopping list.
// $parentLi is the closest parent li to the triggering control
function doFavoriteListToggle($parentLi) {
	var favoriteTextStr = $parentLi.find('.item-text').text();

	$parentLi.toggleClass("checked");

	if ($parentLi.hasClass("checked")) {
		addShoppingListItem(favoriteTextStr, true);
	}
	else {
		var theFav = $('.shopping-check-list li.is-favorite .item-text').filter( function (index) {
				console.log("in filter, text is >" +$(this).text()+ "<");
				return $(this).text() == favoriteTextStr;
			});
		if(theFav.length > 0) {
			console.log("found: >" + $.trim(theFav.text())+"<, length = " + theFav.length);
			theFav.closest('li').remove();
		}
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
