<!DOCTYPE html>
<html>
<head>
    <title>Three test page</title>
    <link rel="stylesheet" type="text/css" href="./css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="./css/styles.css">
</head>
<body>
<div id="flashMessage"></div>

<h1 id="mainTitle">My Three.js Test</h1>


<div id="welcome">
    <a href="#" class="btn btn-lg btn-success"
       data-toggle="modal"
       data-target="#3dModal">Launch 3D</a>
</div>


<div class="modal fade" id="3dModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
                <h4 class="modal-title" id="myModalLabel">My 3D test in a modal</h4>
            </div>
            <div class="modal-body">
                <div id="my3dContainer"></div>
            </div>
        </div>
    </div>
</div>


<script type="x-shader/x-vertex" id="vertexShader">
			varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}

</script>
<script type="x-shader/x-fragment" id="fragmentShader">
			uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );
			}

</script>
<script src="js/lib/jquery.min.js"></script>
<script data-main="js/mainThree" src="js/lib/require.js"></script>
</body>
</html>
