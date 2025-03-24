const floatingMenu = $('#floating-menu');
const floatingMenuCloseButton = $('#close-menu-button');

menuButton.on('click', function() {
	$(this).toggleClass('toggled');
	floatingMenu.toggleClass('opened');
});

floatingMenuCloseButton.on('click', function() {
	menuButton.toggleClass('toggled');
	floatingMenu.toggleClass('opened');
});