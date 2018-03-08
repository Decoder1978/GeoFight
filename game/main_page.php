<?php
	if(!isset($_POST['name'])){
		exit('Cannot access this page!');
	}
?>
<div class="col-md-12">
	<div class="col-md-3">
		<div class="col-md-12 h3">
			<div class="col-md-12 h2 text-center"><?php echo $_POST['name']; ?></div>
			<div class="col-md-12 h3">
				<div class="label label-success">Level <spam class="js-status-level">0</spam></div>
				<div class="progress">
				  <div class="progress-bar js-status-progress-exp" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%">
				    <span class="js-status-exp"></span>/<span class="js-status-exp-nlevel"></span>
				  </div>
				</div>
			</div>
			<div class="col-md-12 h1">
				<div class="label label-warning">Money: $<spam class="js-status-money">0</spam></div>
			</div>
			<div class="col-md-12 h1">
				<div class="label label-danger">Power: <spam class="js-status-power">0</spam></div>
			</div>
		</div>
	</div>
	<div class="col-md-9">
		<ul class="nav nav-tabs">
		  <li class="active"><a data-toggle="tab" href="#fight-tab">Fight</a></li>
		  <li><a data-toggle="tab" href="#inventory-tab">Inventory</a></li>
		  <li><a data-toggle="tab" href="#upgrades-tab">Upgrades</a></li>
		</ul>
		<div class="tab-content">
		  <div id="fight-tab" class="tab-pane fade in active">
		  	<div class="col-md-12 box-monster-pay">
		  		<div class="btn btn-success js-box-monster-refresh" data-rank="0">Free monsters</div>
		  		<div class="btn btn-success js-box-monster-refresh" data-rank="1">More monsters $100</div>
		  		<div class="btn btn-success js-box-monster-refresh" data-rank="2">More monsters $10000</div>
		  		<div class="btn btn-warning js-box-monster-refresh" data-rank="3">More monsters $1000000</div>
		  		<div class="btn btn-danger js-box-monster-refresh" data-rank="4">More monsters $100000000</div>
		  		<div class="btn btn-danger js-box-monster-refresh" data-rank="5">More monsters $10000000000</div>
		  	</div>
		  	<div class="col-md-12">
			  	<table class="table">
				    <thead>
				      <tr>
				        <th>Enemy</th>
				        <th>Rank</th>
				        <th>Power</th>
				        <th></th>
				      </tr>
				    </thead>
				    <tbody class="js-monsters-list">
				    </tbody>
				</table>
		  	</div>
		  </div>
		  <div id="inventory-tab" class="tab-pane fade">
		    <h3>Inventory</h3>
		    <p>Inventory</p>
		  </div>
		  <div id="upgrades-tab" class="tab-pane fade">
		  </div>
		</div>
	</div>
	<div class="modal fade" id="fight-losed-modal" role="dialog">
	    <div class="modal-dialog">
	      <div class="modal-content">
	        <div class="modal-header">
	          <button type="button" class="close" data-dismiss="modal">&times;</button>
	          <h4 class="modal-title">Modal Header</h4>
	        </div>
	        <div class="modal-body">
	          <p>Some text in the modal.</p>
	        </div>
	        <div class="modal-footer">
	          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
	        </div>
	      </div>
	      
	    </div>
	</div>
	<div class="col-md-4 hide">
		<h4>Game Log</h4>
		<div class="game-log">
		</div>
	</div>
</div>