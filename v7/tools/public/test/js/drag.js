$('window').ready(function () {
	var items = $('.item'), dragItem;
	$(document.body).on('mousedown', 'div.item div.title', function (evt) {
		dragItem = $(this).parent();
		dragItem.css({
			position: 'absolute',
			top: evt.pageY,
			left: evt.pageX
		});
	}).on('mouseup', 'div.item div.title', function (evt) {
		dragItem && dragItem.css({
			position: 'absolute',
			top: evt.pageY,
			left: evt.pageX
		});
		dragItem = null;
	});

	$(document).on('mousemove', function (evt) {
		dragItem && dragItem.css({
			position: 'absolute',
			top: evt.pageY,
			left: evt.pageX
		});
	})

});