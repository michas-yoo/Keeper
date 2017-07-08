const items = $.parseJSON(localStorage.getItem('items')) || [];
const itemsBoard = $('#mainBoard');
var currentIndex = -1;

//			ALL THE FUNCTIONS


// Adding new item
function addItem(){
	const type = $('#type').val();
	const heading = $('#heading').val();
	const text = $('#text').val();
	
	const item = {
		type,
		heading, 
		text
	};

	if(heading != '' && text != ''){
		items.push(item);
		updateList(items, itemsBoard);
		localStorage.setItem('items', JSON.stringify(items));
	} else {
		return;
	}
}

// Loop through the items array and add a div to the itemsBoard
function updateList(cards = [], cardList){
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

// Opening settings popup
function openSettings(e){
	const popupDisplay = $('#popup').css('display');

	if(popupDisplay != 'none') $('#closeButton').trigger('click');

	// If it's clicked on the item's child, send click to the item itself
	if(e.target.matches('.colorCircle') || e.target.matches('.heading') || e.target.matches('.text')) e.target = $(e.target).parent();

	const index = $(e.target).data('index');
	console.log(e.target);
	if($('#settings').css('display') == 'none'){
		console.log('yeah, it is');
		$('#settings').css('display', 'flex');
	}
	$('.header').val(items[index].heading);
	$('.textVal').val(items[index].text);
	
	currentIndex = index;
} 

// Deleting the item
function deleteItem(item){
	if(confirm('Delete item?') == true){
		items.splice(item, 1);
		localStorage.setItem('items', JSON.stringify(items));
		updateList(items, itemsBoard);
		checkNotes();
	} else {
		return;
	}
}

// Editing the item
function editItem(item){
	items[item].heading = $('.header').val();
	items[item].text = $('.textVal').val();
	localStorage.setItem('items', JSON.stringify(items));
	updateList(items, itemsBoard);
	checkNotes();
	$('#settings').css('display') == 'flex' ? $('#settings').css('display', 'none') : ''
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

		// Add styles to the color-type notes
		for(let n of items){
			if(n.type === 'Color'){
				let mh = $('.item').find('div.colorCircle').siblings('h2').css('height');
				$('.item').find('div.colorCircle').css('margin-top', `${parseInt(mh)+20}px`)
			}
		}
	}
}


// 			EVENT LISTENERS


// Add items from localStorage or a message
items == '' ? checkNotes() : updateList(items, itemsBoard);

// openSettings function starts after click
$('.item').on('click', openSettings);

// Opening the popup window
$("#addButton").click(() => {
	$('#popup').fadeIn(300).css('display', 'flex');
	$('#heading').focus();
});

// Closing the popup window
$("#closeButton").on("click", () => $("#popup").css('display', 'none'));

// Editing the item
$('#setOk').on('click', function(){
	editItem(currentIndex);
});

// Add item after click
$('#okBut').on('click', () => {
	addItem();
	$('#popup').css('display', 'none');
	$('input').each(function(){$(this).val('')});
});

// Change placeholder according to note type
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

// Using buttons for controls
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


// // 			SERVICE WORKER

// if('serviceWorker' in navigator){
// 	navigator.serviceWorker.register('sw.js')
// 	.then(function() {
// 		console.log("Service Worker Registered"); 
// 	});
// };