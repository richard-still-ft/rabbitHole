<!DOCTYPE html>
<html>
<?php 
	include('inc/head.inc.php');
?>
<body>
	<div id="doingStuff">
	    <div class="progress progress-striped active">
	    <div class="bar" style="width: 100%;"></div>
	    </div>
	</div>


    <div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
    <a class="brand" href="#">Bohemian Apsody</a>
    <ul class="nav" id="nav">
    <li class="active" id="searchNav"><a href="#">Search</a></li>
    <li id="resultsNav"><a href="#">Results list</a></li>
    <li id="itemNav"><a href="#">The results</a></li>

    </ul>
    </div>
    </div>
	<div id="bunny"></div>
	<div id="sb">
	    <form class="form-inline">
		    <input class="span3" id="appendedInputButtons" type="text">
		    <button class="btn btn-success" type="button" id="doIt">Do it!</button>
		    <button class="btn btn-primary" type="button" id="goRandom">FT Lucky!</button>
	    </form>
	</div>

	<div id="popular">
		<h3>Popular right now</h3>
		<div id="popularList">
				    <div class="progress progress-striped active">
	    <div class="bar" style="width: 100%;"></div>
	    </div>
		</div>
	</div>

	<div id="resultsList">
	    <div class="container-fluid">
		    <div class="row-fluid">
			    <div class="span12" id="searchResults">
			    <!--Body content-->Main
			    </div>
		    </div>
	    </div>
	</div>

	<div id="itemContent">	    <div class="row-fluid">
    <div class="span6" id="itemBody">
    	<div class="itemContent">
    		<h1 id="title">Nufink yet!</h1>
    		<div id="story">Do a search!</div>
    	</div>
    </div>
    <div class="span3" id="leftColMeta">
		Exciting metadata here
    </div>

    <div class="span3" id='rightColMeta'>
    	Exciting metadata here
    </div>
    </div></div>
</body>
</html>