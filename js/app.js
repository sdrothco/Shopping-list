
$(document).ready(function() {



	$('.shopping-check-list').on('mouseenter', 'li', function() {
		$(this).addClass('highlighted');
	})
	.on('mouseleave', 'li', function() {
		$(this).removeClass('highlighted');

	});


	$('.shopping-check-list, .favorites-check-list').on('click', '.checkbox, .item-text', function() {
		$(this).closest("li").toggleClass("checked");
	})
	.on('click', '.icon-star2', function () {
		console.log("favoriting item");
		//todo add functionality here!
    })
	.on('click', '.icon-pencil', function () {
		console.log("editing item");
		var $parentLi = $(this).closest("li");
		$parentLi.find(".edit-item").toggle().focus();
		$parentLi.find(".item-text").toggle();
    })
    .on('click', '.icon-remove', function () {
		console.log("removing item");
		$(this).closest("li").remove();
    })
    .on('keyup', '.edit-item', function(event) {
        if (event.keyCode == 13) {
            editItem($(this));
         }
    });


	$('#add-item').on('keyup', function(event) {
        if (event.keyCode == 13) {
            addItem();
         }
    });
    $('.add-button').on('click', function() {
            addItem();
    });

    $('.select-all').on('click', '.checkbox', function() {
    	var $parentDiv = $(this).closest("div");

		$parentDiv.toggleClass("checked");


	});

});



function addItem() {
    var $textField = $('#add-item'),
		textFieldVal = $.trim($textField.val());

    if( textFieldVal !== '' ) {
		var newItem = $('<li><a data-icon="&#xe60b;" class="icon-checkbox-unchecked checkbox" href="#"></a>'
			+'<a data-icon="&#xe60b;" class="icon-checkbox-checked checkbox" href="#"></a>'
			+' <input class="edit-item" type="text" value="'+textFieldVal+'"><span class="item-text">'
			+textFieldVal+ '</span><span class="item-controls">'
			+'<a href="#" data-icon="&#xe600;" class="icon-pencil"></a><a href="#" data-icon="&#xe606;" class="icon-star2"></a><a href="#" data-icon="&#xe604;" class="icon-remove"></a></li>');
		console.log(textFieldVal);
		$('.shopping-check-list').append(newItem);
	}
	else {
		alert("Please enter an item to add to the list.");
	}
	$textField.val('');  // in case there was trimmed whitespace
}

function editItem ($textField) {
	// var $textField = $('.edit-item'),
	var	textFieldVal = $.trim($textField.val());
	if( textFieldVal !== '' ) {
		console.log("Edit: " +textFieldVal);
		$textField.closest("li").find('.item-text').text(textFieldVal);
		$textField.closest("li").find('.icon-pencil').click();
	}
}