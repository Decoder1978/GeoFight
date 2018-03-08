<?php
if(!isset($_POST['rank']) && !isset($_GET['rank'])){
	exit('Cannot access this page!');
}

$json = file_get_contents('monsterlist.json');
$mlist = json_decode($json);
header("Content-type:application/json");

$monsterReturn = array();

for ($i=0; $i < 10; $i++) {
	$monster = getRandomMonster($mlist, $_POST['rank']);
	$monster->power = getPowerByRank($_POST['rank']);
	$monster->reward = getRewardByRank($_POST['rank']);
	array_push($monsterReturn, $monster);
}

function getRandomMonster($mlist, $rank){
	srand((float)microtime()*1000000);
	shuffle($mlist);
	foreach ($mlist as $monster) {
		if($monster->rank <= $rank){
			return $monster;
		}
	}
}
function getPowerByRank($rank){
	switch ($rank) {
		case 0:
			return mt_rand(1,10);
			break;
		case 1:
			return mt_rand(10,1000);
			break;
		case 2:
			return mt_rand(1000,10000);
			break;
		case 3:
			return mt_rand(10000,100000);
			break;
		case 4:
			return mt_rand(100000, 10000000);
			break;
		case 5:
			return mt_rand(10000000, 100000000000);
			break;
		default:
			# code...
			break;
	}
}
function getRewardByRank($rank){
	$reward = new stdClass();
	switch ($rank) {
		case 0:
			$reward->money = mt_rand(1, 10);
			$reward->exp = mt_rand(1, 5);
			break;
		case 1:
			$reward->money = mt_rand(10, 100);
			$reward->exp = mt_rand(1, 5);
			break;
		case 2:
			$reward->money = mt_rand(100, 10000);
			$reward->exp = mt_rand(1, 5);
			break;
		case 3:
			$reward->money = mt_rand(10000, 1000000);
			$reward->exp = mt_rand(1, 5);
			break;
		case 4:
			$reward->money = mt_rand(1000000, 100000000);
			$reward->exp = mt_rand(1, 5);
			break;
		case 5:
			$reward->money = mt_rand(100000000, 10000000000);
			$reward->exp = mt_rand(1, 5);
			break;
		default:
			# code...
			break;
	}
	return $reward;
}
exit(json_encode($monsterReturn));
?>

					  