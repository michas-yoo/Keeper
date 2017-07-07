const items = $.parseJSON(localStorage.getItem('items')) || [];
const itemsBoard = $('#mainBoard');


//			ALL THE FUNCTIONS


// Adding new item
function addItem(){
	const type = $('#type').val();
	const heading = $('#heading').val();
	const text = $('#text').val();
	
	if(type != 'Type'){
		const item = {
			type,
			heading, 
			text
		};
		if(heading != '' && text != ''){
			items.push(item);
			addToList(items, itemsBoard);
			localStorage.setItem('items', JSON.stringify(items));
		} else {
			return;
		}
	} else {
		alert('You forgot to select the type of the note');
	}
}

// Loop through the items array and add a div to the itemsBoard
function addToList(cards = [], cardList){
	cardList.html(cards.map((card, i) => {
		if(card.type != 'Color'){
			return `<div class="item" data-index=${i}>
								<h2 class="heading">${card.heading}</h2>
								<h3 class="text">${card.text}</h3>
							</div>`;
		} else {
			return `<div class="item" data-index=${i}>
								<h2 class="heading">${card.heading}</h2>
								<div class="colorCircle" style="background-color: ${card.text}"></div>
								<h3 class="text">${card.text}</h3>
							</div>`; 
		}
	}).join(''));
	checkNotes();
}

// Deleting the item
function deleteItem(e){
	const popupDisplay = $('#popup').css('display');

	if(popupDisplay != 'none') $('#closeButton').trigger('click');

	if(!e.target.matches('div')) return;
	
	if(confirm('Delete item?') == true){
		const index = $(e.target).data("index");

		items.splice(index, 1);
		localStorage.setItem('items', JSON.stringify(items));
		addToList(items, itemsBoard);
		checkNotes();
	} else {
		return;
	}
}

// Add some text if there are no notes
function checkNotes(){
	if(items == ''){
		itemsBoard.hasClass('some-notes') ? itemsBoard.removeClass('some-notes') : '';
		itemsBoard.addClass('no-notes');
		itemsBoard.html("<h1 class='empty'>You have no notes! It's great time to make some ;)</h1>");
	} else {
		itemsBoard.hasClass('no-notes') ? itemsBoard.removeClass('no-notes') : '';
		itemsBoard.addClass('some-notes');

		// Add styles to the color type notes
		for(let n of items){
			if(n.type === 'Color'){
				let mh = $('.item').find('div.colorCircle').siblings('h2').css('height');
				$('.item').find('div.colorCircle').css('margin-top', `${parseInt(mh)+20}px`)
			}
		}
	}
}


// EVENT LISTENERS


// Add items from localStorage or a note
items == '' ? checkNotes() : addToList(items, itemsBoard);

// Delete item function starts after click
$('#mainBoard').on('click', deleteItem);

// Opening the popup window
$("#addButton").click(() => {
	$('#popup').fadeIn(300).css('display', 'flex');
	$('#heading').focus();
});

// Closing the popup window
$("#closeButton").on("click", () => $("#popup").css('display', 'none'));

// Add item
$('#okBut').on('click', () => {
	addItem();
	$('#popup').css('display', 'none');
	$('input').each(function(){$(this).val('')});
});

$('#type').on('click', function(){
	if($('#type').val() == 'Link' || $('#type').val() == 'Password'){
		$('#heading').attr('placeholder', ' Website');
	}

	if($('#type').val() == 'Color'){
		$('#heading').attr('placeholder', ' Color name');
	}

	if($('#type').val() == 'Font'){
		$('#heading').val('Awesome font');
	}
});

// Using button for control
$(document).keydown(function(e){
	const popupDisplay = $('#popup').css('display');
	const KEY_ENTER = 13;
	const KEY_ESCAPE = 27;

	if(popupDisplay != 'none'){
		if(e.which == KEY_ENTER){
			$('#okBut').trigger('click');
		}

		if(e.which == KEY_ESCAPE){
			$('#closeButton').trigger('click');
		}
	}
});


// SERVICE WORKER

if('serviceWorker' in navigator){
	navigator.serviceWorker.register('sw.js')
	.then(function() {
		console.log("Service Worker Registered"); 
	});
};