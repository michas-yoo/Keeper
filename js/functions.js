const items = $.parseJSON(localStorage.getItem('items')) || [], itemsBoard = $('#mainBoard');
const colorCodes = ['#ffffff', '#ccff90', '#80d8ff', '#ffff8d'];
var currentIndex = -1;

// Add background to notes
for(let n of $('.color')){
	$(n).css('background-color', colorCodes[$(n).data('colorcode')]);
}


//			ALL THE FUNCTIONS


// Adding new item
function addItem(){
	const type = $('#type').val();
	const heading = $('#heading').val();
	const text = $('#text').val();
	
	const item = {
		type,
		heading, 
		text,
		color: '#ffffff'
	};

	if(heading != '' && text != ''){
		items.push(item);
		updateList(items, itemsBoard);
		localStorage.setItem('items', JSON.stringify(items));
	} else {
		return;
	}
}

// Fill the inputBoard
function updateList(cards = [], cardList){
	cardList.html(cards.map((card, i) => {
		if(card.type != 'Color'){
			return `<div class="item" data-index=${i} style="background-color: ${card.color}">
								<h2 class="heading">${card.heading}</h2>
								<h3 class="text">${card.text}</h3>
							</div>`;
		} else {
			return `<div class="item" data-index=${i} style="background-color: ${card.color}">
								<h2 class="heading">${card.heading}</h2>
								<div class="colorCircle" style="background-color: ${card.text}"></div>
								<h3 class="text">${card.text}</h3>
							</div>`; 
		}
	}).join(''));
	checkNotes();
}

// Open the settings popup
function openSettings(e){
	// if clicked not on the item do nothing
	if(e.target.matches('section')) return;

	const popupDisplay = $('#popup').css('display');

	if(popupDisplay != 'none') $('#closeButton').trigger('click');

	// If it's clicked on the item's child, send click to the item itself
	if(e.target.matches('.colorCircle') || e.target.matches('.heading') || e.target.matches('.text')) e.target = $(e.target).parent();

	const index = $(e.target).data('index');

	$('#settings').css('display') == 'none' ? $('#settings').fadeIn(300).css('display', 'flex') : '';

	$('.header').val(items[index].heading);
	$('.textVal').val(items[index].text);
	
	currentIndex = index;
} 

// Short hand to updating itemsBoard
function saveAndClose(){
	localStorage.setItem('items', JSON.stringify(items));
	updateList(items, itemsBoard);
	checkNotes();
	$('#settings').css('display') != 'none' ? $('#settings').fadeOut(300) : '';
	$('#search').val('');
}

// Delete the item
function deleteItem(item){
	if(confirm('Delete item?') == true){
		items.splice(item, 1);
		saveAndClose();
	} else {
		return;
	}
}

// Edit the item
function editItem(item){
	items[item].heading = $('.header').val();
	items[item].text = $('.textVal').val();
	saveAndClose();
}

// Find items
function findMatch(word){
	// Do nothing if the search field is empty
	if (word === '') {
		saveAndClose();
		return;
	}

	const whatMatched = [];

	let matched = items.filter(item => {
		const regexp = new RegExp(word, 'gi');
		if(item.heading.match(regexp)){
			whatMatched.push('heading');
			return item.heading;
		}
		else if(item.text.match(regexp)){
			whatMatched.push('text');
			return item.text;
		}
	});

	let arr = $('.item'), i = 0;

	if(matched.length == 0) {
		alert('No matches...');
		saveAndClose();
	}

	for (let n of matched){
		for (let a = 0; a < arr.length; a++){
			if(n.heading == $(arr).eq(a).find('.heading').text()){
	 			$(arr).eq(a).css('display', 'flex');
	 			whatMatched[i] == 'heading' ? $(arr).eq(a).find('.heading').css('background-color', '#fed280') : $(arr).eq(a).find('.text').css('background-color', '#fed280');
	 			i++;
				arr.splice(a, 1);
			} else { 
				$(arr).eq(a).css('display', 'none');
			}
		}
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

		// Add styles to the color-type notes
		for(let n of items){
			if(n.type === 'Color'){
				// Calculate the MarginHeight by adding 20px to the header's height
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
$('#mainBoard').on('click', openSettings);

// Open the popup window and focus on the heading input
$("#addButton").click(() => {
	$('#popup').fadeIn(300).css('display', 'flex');
	$('#heading').focus();
});

// Close the popup window
$("#closeButton").on("click", () => $("#popup").fadeOut(300));

// Edit the item
$('#setOk').on('click', () => editItem(currentIndex));

// Delete the item
$('.del').on('click', () => deleteItem(currentIndex));

// Open color palette
$('.palette').on('click', () => $('.colorPick').css('display') == 'none' ? $('.colorPick').css('display', 'flex') : $('.colorPick').css('display', 'none'));

// Edit item's background color
$('.color').on('click', function(){
	items[currentIndex].color = colorCodes[$(this).data('colorcode')];
	$('.colorPick').css('display', 'none');
	saveAndClose();
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

// Calling findMatch funtion
$('#search').on('keyup', function(){
	findMatch($(this).val());
});

// Using buttons for adding new Item 
$(document).keydown(function(e){
	const popupDisplay = $('#popup').css('display');
	const KEY_ENTER = 13;
	const KEY_ESCAPE = 27;

	if(popupDisplay != 'none'){
		if(e.which == KEY_ENTER){
			$('#okBut').trigger('click');
		}

		if(e.which == KEY_ESCAPE){
			$('#popup').css('display') != 'none' ? $('#closeButton').trigger('click') : '';
		}
	}
});

// 			SERVICE WORKER

if('serviceWorker' in navigator){
	navigator.serviceWorker.register('sw.js')
	.then(function() {
		console.log("Service Worker Registered"); 
	});
};