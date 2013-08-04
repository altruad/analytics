<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
	<title>Altruad: Barebones example</title>
	<script type="text/javascript">
		Alt = window.Alt || {};
		Alt.publisher = 1;
	</script>

    <script src="js/utility.js" type="text/javascript"></script>
    <script src="js/visit.js" type="text/javascript"></script>
    <script src="js/events.js" type="text/javascript"></script>
    <script src="js/jsonp.js" type="text/javascript"></script>
    <script src="js/init.js" type="text/javascript"></script>
    <script src="js/tooltip.js" type="text/javascript"></script>
    <script src="js/ready.js" type="text/javascript"></script>

	<link rel="stylesheet" type="text/css" href="buttons.css" />
	<!-- default tooltip styles, merge into buttons.css when fully customized -->
	<style type="text/css">
		body {
			font-family: arial, sans-serif;
		}
		.vertical {
			display:block;
			width:100px;
		}
	</style>
</head>
	
<body>
	<h1>Vertical</h1>
	<span class="altruad vertical"></span>
    <div style="clear:both;"></div>
	<h1>Horizontal</h1>
	<span class="altruad horizontal"></span>
</body>
</html>