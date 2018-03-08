var Game = function(name) {
	var exp = 1;
	var money = 0;
	var power = 1;
	this.addExp = function(ex){
		exp += ex;
	}
	this.balance = {
		pay: function(val){
			if(money >= val){
				money = money-val;
				return true;
			}else{
				return false;
			}
		},
		add: function(val){
			money += val;
		}
	}
	this.addPower = function(pw){
		power += pw;
	}
	this.getPower = function(){
		return power;
	}
	this.reward = function(reward){
		if(reward.money){
			this.balance.add(reward.money);
		}
		if(reward.exp){
			this.addExp(reward.exp);
		}
		if(reward.power){
			this.addPower(reward.power);
		}
	}
	var refreshTask = setInterval(function(){
		var level = Math.pow(exp ,1/4);
		var nextLevel = Math.pow(parseInt(level+1), 4);
		var nextLevelPercentage = ((exp*100)/nextLevel);

		$('.js-status-level').html(parseInt(level));
		$('.js-status-exp').html(exp);
		$('.js-status-progress-exp').css('width', nextLevelPercentage+'%');
		$('.js-status-exp-nlevel').html(nextLevel);
		$('.js-status-money').html(money.toFixed(2));
		$('.js-status-power').html(power);
	}, 100);

	/////////////////////////    Start Game   //////////////////////////////
	$.post('game/monster_list.php', 
		{
			rank: 0
		},
		function(res){
			monsters = res;
			refreshMonsterList(res);
	});
}
var MonsterTools = {
	getMonster: function(id){
		for (var i = monsters.length - 1; i >= 0; i--) {
			if(monsters[i].id == id){
				return monsters[i];
			}
		}
	},
	rankStars: function(rank){
		var res = "";
		if(rank != 0){
			for (var j=0; j < rank; j++) { 
				res = res+'<i class="fa fa-star-o" aria-hidden="true"></i>';
			}
		}else{
			res = '<i class="fa fa-star-half" aria-hidden="true"></i>';
		}
		return res;
	}
}
var refreshMonsterList = function(monsters){
	var html = "";
	for (var i = monsters.length - 1; i >= 0; i--) {
		var rank = "";
		if(monsters[i].rank != 0){
			for (var j=0; j < monsters[i].rank; j++) { 
				rank = rank+'<i class="fa fa-star-o" aria-hidden="true"></i>';
			}
		}else{
			rank = '<i class="fa fa-star-half" aria-hidden="true"></i>';
		}
		html = html+'<tr class="js-fight-monster-id-'+monsters[i].id+'">\
				        <td>'+monsters[i].name+'</td>\
				        <td>\
				        	'+rank+'\
				        </td>\
				        <td>'+monsters[i].power+'</td>\
				        <td><div class="btn btn-default js-fight-button" data-monsterid="'+monsters[i].id+'">Fight</div></td>\
				    </tr>';
	}
	$('.js-monsters-list').html(html);
	gameEvents.refreshMonsterListListeners();
}

var GameEvents = function(){
	$('.js-box-monster-refresh').click(function(){
		if($(this).attr('data-rank') == 0 || game.balance.pay(Math.pow(100, $(this).attr('data-rank')))){
			$.post('game/monster_list.php', 
				{
					rank: $(this).attr('data-rank')
				},
				function(res){
					monsters = res;
					refreshMonsterList(monsters);
			});
		}
	});
	this.refreshMonsterListListeners = function(){
		$('.js-fight-button').click(function(){
			var monster = MonsterTools.getMonster($(this).attr('data-monsterid'));
			$('.js-fight-monster-id-'+monster.id).remove();
			var html = '<div id="js-figth-modal-'+monster.id+'" class="modal fade text-center" role="dialog">\
				  <div class="modal-dialog">\
				    <div class="modal-content">\
				      <div class="modal-header">\
				        <h4 class="modal-title">'+monster.name+' <small>'+MonsterTools.rankStars(monster.rank)+'</small></h4>\
				      </div>\
				      <div class="col-md-12">\
				      	<div class="col-md-4 col-md-offset-4">\
				      		<img class="img-responsive" src="images/sword.png">\
				      	</div>\
				      </div>\
				      <div class="modal-footer text-center">\
				      	<div class="col-md-12">\
				      		<div class="col-md-8">\
					      		<div class="progress">\
								  <div class="progress-bar progress-bar-success js-fight-atack-progress-'+monster.id+'" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
								    0% Fighting\
								  </div>\
								</div>\
							</div>\
							<div class="col-md-4">\
								<button type="button" class="btn btn-success js-fight-atack-'+monster.id+'">Atack</button>\
				       			<button type="button" class="btn btn-warning js-fight-run-'+monster.id+'">Run</button>\
							</div>\
				      	</div>\
				      </div>\
				    </div>\
				  </div>\
				</div>';
				$('body').append(html);
				$('.js-fight-run-'+monster.id).click(function(){
					$('#js-figth-modal-'+monster.id).modal("toggle");
					$('#js-figth-modal-'+monster.id).remove();
					$('.modal-backdrop').remove();
				});
				$('.js-fight-atack-'+monster.id).click(function(){
					new Fight(monster);
				});
				$('#js-figth-modal-'+monster.id).modal({backdrop: 'static', keyboard: false});
		});
	}
}

var Fight = function(monster){
	var finish = function(){
		game.reward(monster.reward);
		GameLogger.win(monster);
		$('#js-figth-modal-'+monster.id).modal("toggle");
		$('#js-figth-modal-'+monster.id).remove();
		$('.modal-backdrop').remove();
		$('body').append('<div class="modal fade" id="fight-lose-modal-'+monster.id+'" role="dialog">\
						    <div class="modal-dialog modal-sm">\
						      <div class="modal-content">\
						        <div class="modal-header">\
						          <button type="button" class="close" data-dismiss="modal">&times;</button>\
						          <h1 class="modal-title text-center">You WIN</h1>\
						        </div>\
						        <div class="modal-body text-center">\
						          <p>You kill the '+monster.name+'.</p>\
						          <p>You win:</p>\
						          <p>$'+monster.reward.money+'</p>\
						          <p>'+monster.reward.exp+'xp</p>\
						        </div>\
						        <div class="modal-footer">\
						          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
						        </div>\
						      </div>\
						    </div>\
						</div>');
		$('#fight-lose-modal-'+monster.id).modal();
	}
	var lose = function(){
		GameLogger.lose(monster);
		$('#js-figth-modal-'+monster.id).modal("toggle");
		$('#js-figth-modal-'+monster.id).remove();
		$('.modal-backdrop').remove();
		$('body').append('<div class="modal fade" id="fight-lose-modal-'+monster.id+'" role="dialog">\
						    <div class="modal-dialog modal-sm">\
						      <div class="modal-content">\
						        <div class="modal-header">\
						          <button type="button" class="close" data-dismiss="modal">&times;</button>\
						          <h1 class="modal-title text-center">You LOSE</h1>\
						        </div>\
						        <div class="modal-body text-center">\
						          <p>'+monster.name+' break you.</p>\
						          <p>You lose $'+monster.reward.money+'</p>\
						        </div>\
						        <div class="modal-footer">\
						          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
						        </div>\
						      </div>\
						    </div>\
						</div>');
		$('#fight-lose-modal-'+monster.id).modal();
	}
	var time;
	//Decide times
	if(monster.power > game.getPower()){
		return lose();
	}else if((game.getPower()-monster.power) == 0){
		time = monster.power * 1000;
	}else{
		time = (monster.power * 1000)/(game.getPower()-monster.power);
	}
	var cicleTime = time / 100;
	var cicles = 100;
	var task = setInterval(function(){
		if(cicles == 0){
			finish();
			clearInterval(task);
			return true;
		}else if(cicles < 0){
			return true;
		}
		cicles--;
		$('.js-fight-atack-progress-'+monster.id).css('width',cicles+'%');
	});
}

var GameLogger = {
	lose: function(monster){
		$('.game-log').prepend('<div class="alert alert-danger">\
				You lose the fight with <strong>'+monster.name+'!</strong>.\
			</div>');
	},
	win: function(monster){
		$('.game-log').prepend('<div class="alert alert-danger">\
				You win the fight with <strong>'+monster.name+'!</strong>.\
			</div>');
	}
}

var GameUpgrades = function(){
	var upgrades = [
		{
			id: 1,
			name: 'Soul of Dignity',
			description: '+1 Power',
			reward: {power: 1},
			price: 50
		},
		{
			id: 2,
			name: 'Soul of Thirst',
			description: '+100 Power',
			reward: {power: 100},
			price: 4750
		},
		{
			id: 3,
			name: 'Soul of Emperor',
			description: '+1000 Power',
			reward: {power: 1000},
			price: 451250
		},
		{
			id: 4,
			name: 'Soul of Dinasty',
			description: '+10000 Power',
			reward: {power: 10000},
			price: 42868750
		},
		{
			id: 4,
			name: 'Soul of Loneliness',
			description: '+100000 Power',
			reward: {power: 100000},
			price: 4072531250
		},
		{
			id: 4,
			name: 'Soul of Forgiveness',
			description: '+1000000 Power',
			reward: {power: 1000000},
			price: 38689046875000
		},
		{
			id: 4,
			name: 'Soul of Eternity',
			description: '+10000000 Power',
			reward: {power: 10000000},
			price: 3675459453125000

		}
	]
	var upgradesHtml = "";
	for (var i = 0; i < upgrades.length; i++) {
		upgradesHtml = upgradesHtml+'<tr>\
								        <td>'+upgrades[i].name+'</td>\
								        <td>'+upgrades[i].description+'</td>\
								        <td class="js-upgrade-refresh-price-'+upgrades[i].id+'">$'+upgrades[i].price+'</td>\
								        <td><div class="btn btn-default js-upgrade-buy" data-upgradeid="'+upgrades[i].id+'">Buy</div></td>\
								      </tr>';
	}
	$('#upgrades-tab').html('<table class="table table-striped">\
    <thead>\
      <tr>\
        <th>Upgrade</th>\
        <th>Description</th>\
        <th>Price</th>\
        <th></th>\
      </tr>\
    </thead>\
    <tbody>\
      '+upgradesHtml+'\
    </tbody>\
  </table>');
	$('.js-upgrade-buy').click(function(){
		for (var i = upgrades.length - 1; i >= 0; i--) {
			if($(this).attr('data-upgradeid') == upgrades[i].id){
				if(game.balance.pay(upgrades[i].price)){
					game.reward(upgrades[i].reward);
					upgrades[i].price = (upgrades[i].price*0.1)+upgrades[i].price;
					refreshUpgrade($(this).attr('data-upgradeid'), upgrades[i].price);
					break;
				}else{
					gameAlerts.alertMoney();
				}
			}
		}
	});
	var refreshUpgrade = function(id, value){
		$('.js-upgrade-refresh-price-'+id).html('$'+value);
	}
}

var GameAlerts = function(){
	$('body').append('<div class="modal fade" id="alert-modal" role="dialog">\
					    <div class="modal-dialog modal-sm">\
					      <div class="modal-content">\
					        <div class="modal-header">\
					          <button type="button" class="close" data-dismiss="modal">&times;</button>\
					          <h1 class="modal-title text-center js-alert-message-title"></h1>\
					        </div>\
					        <div class="modal-body text-center">\
					          <p class="js-alert-message-body"></p>\
					        </div>\
					        <div class="modal-footer">\
					          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
					        </div>\
					      </div>\
					    </div>\
					</div>');
	this.alertMoney = function(){
		$('.js-alert-message-title').html('Alert');
		$('.js-alert-message-body').html('You can not afford it!');
		$('#alert-modal').modal();
	}
}