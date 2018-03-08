var game;
var monsters;
$(document).ready(function(){
	$('#box-start-name-request').modal({backdrop: 'static', keyboard: false});
	$('.js-start-done').click(function(){
		$.post('game/main_page.php', 
			{
				name: $('.js-start-name').val()
			},
			function(res){
				$('body').html(res);
				game = new Game();
				gameEvents = new GameEvents();
				gameUpgrades = new GameUpgrades();
				gameAlerts = new GameAlerts();
		});
	});
});
