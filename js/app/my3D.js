define(['jquery', '3D/three', '3D/stats', '3D/controls/OrbitControls'],
    function ($, THREE, Stats3D, OrbitControls) {

        var my3D = {

            container: $('#my3dContainer'),

            renderer: null,

            scene: null,

            camera: null,

            controls: null,

            stats: null,

            clock: null,

            initialize: function () {

                this.clock = new THREE.Clock();

                this.initStats();

                this.initCamera();

                this.initScene();

                this.initControls();

                this.initEventListener();
            },

            /**
             * init the scene
             */
            initScene: function () {

                this.scene = new THREE.Scene();
                this.scene.fog = new THREE.Fog(0xffffff, 1000, 10000);

                this.camera.lookAt(this.scene.position);

                this.initLights();

                this.initSky();

                this.initRenderer();

                this.addGround();

                this.addDefaultObject();

            },

            /**
             * init the renderer
             */
            initRenderer: function () {

                this.renderer = new THREE.WebGLRenderer({ antialias: true });
                this.renderer.setClearColor(this.scene.fog.color);
                //this.renderer.setSize(window.innerWidth, window.innerHeight);
                var width = window.innerWidth*0.9;
                var height = ((width*window.innerHeight)/width)-250;
                this.renderer.setSize(width, height);
                this.renderer.domElement.style.position = "relative";

                // configure shadows
                this.renderer.shadowMapEnabled = true; // enable shadows
                this.renderer.shadowMapSoft = true; // soften shadow edge
                this.renderer.shadowMapType = THREE.PCFSoftShadowMap; // to antialias the shadow

                // check what it exactly is...
                this.renderer.gammaInput = true;
                this.renderer.gammaOutput = true;

                // shadows parameters
                this.renderer.shadowMapBias = 0.0039;
                this.renderer.shadowMapDarkness = 0.5;
                this.renderer.shadowMapWidth = window.innerWidth;
                this.renderer.shadowMapHeight = window.innerHeight;

                this.container.append(this.renderer.domElement);
            },

            /**
             * init stats
             */
            initStats: function () {
                // to display stats on html page
                this.stats = new Stats();
                this.container.append(this.stats.domElement);
            },

            /**
             * init the camera
             */
            initCamera: function () {
                // new camera
                this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);

                // Camera position set(x, y, z)
                this.camera.position.set(0.7, 2.5, 8);
            },

            /**
             * init controls
             */
            initControls: function () {
                this.controls = new THREE.OrbitControls(this.camera);

                // Avoid going below the ground
                this.controls.maxPolarAngle = Math.PI / 2;
            },

            initLights: function () {

                var directionalLight = new THREE.DirectionalLight(0xffffff,1);
                directionalLight.position.set(10, 10, 10);
                directionalLight.target.position.set(0, 0, 0);

                // enableshadows
                directionalLight.castShadow = true;
                directionalLight.shadowDarkness = 0.5;


                directionalLight.shadowCameraNear = 2;
                directionalLight.shadowCameraFar = 25;
                directionalLight.shadowCameraLeft = -5;
                directionalLight.shadowCameraRight = 5;
                directionalLight.shadowCameraTop = 5;
                directionalLight.shadowCameraBottom = -5;
                //directionalLight.shadowCameraVisible = true; // to debug above parameters

                this.scene.add(directionalLight);

                var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.25);
                hemiLight.id = 'hemiLight';
                hemiLight.color.setHSL(0.6, 1, 0.75);
                hemiLight.groundColor.setHSL(0.1, 0.8, 0.7);
                hemiLight.position.y = 500;
                this.scene.add(hemiLight);
            },

            initSky: function () {
                var vertexShader = $('#vertexShader').html();
                var fragmentShader = $('#fragmentShader').html();
                var uniforms = {
                    topColor: { type: "c", value: new THREE.Color(0x0077ff) },
                    bottomColor: { type: "c", value: new THREE.Color(0xffffff) },
                    offset: { type: "f", value: 400 },
                    exponent: { type: "f", value: 0.6 }
                }

                uniforms.topColor.value.copy(this.scene.getObjectById('hemiLight').color);

                this.scene.fog.color.copy(uniforms.bottomColor.value);

                var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
                var skyMat = new THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    side: THREE.BackSide
                });

                var sky = new THREE.Mesh(skyGeo, skyMat);
                this.scene.add(sky);
            },

            /**
             * init the event listeners
             */
            initEventListener: function () {
                var _self = this;
                window.addEventListener('resize', _self.onWindowResize.bind(_self), false);
            },

            addGround: function () {
                var _self = this;

                groundTexture = THREE.ImageUtils.loadTexture(require.toUrl("../../img/textures/ground_tex.png"));

                var groundGeo = new THREE.PlaneGeometry(4000, 4000);
                var groundMat = new THREE.MeshPhongMaterial({
                    color: "rgb(254, 255, 255)",
                    map: groundTexture,
                    mapBump: groundTexture
                });

                var ground = new THREE.Mesh(groundGeo, groundMat);
                ground.id = 'ground';
                ground.rotation.x = -Math.PI / 2;
                ground.material.map.repeat.set(400, 400);
                ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
                ground.receiveShadow = true;
                ground.position.y -= 0.9;
                this.scene.add(ground);
                this.scene.ground = ground;
            },

            /**
             * build test default Object
             */
            addDefaultObject: function () {
                var _self = this;

                var geometry = new THREE.BoxGeometry(1, 1, 1);
                var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                this.cube = new THREE.Mesh(geometry, material);
                this.cube.castShadow = true;
                this.scene.add(this.cube);

                this.animate();
            },

            /**
             * animate
             */
            animate: function () {
                var _self = this;

                this.render();

                this.stats.update();

                requestAnimationFrame(_self.animate.bind(_self));
            },

            /**
             * render
             */
            render: function () {
                this.renderer.render(this.scene, this.camera);
            },

            /**
             * update scene on window resize
             */
            onWindowResize: function () {

                var width = window.innerWidth*0.9;
                var height = ((width*window.innerHeight)/width)-150;
                this.renderer.setSize(width, height);

                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();


            },

            displayMessage: function (error) {
                $('#flashMessage').html("<div style='color:white;background:green'>" + error + "</div>");
            }

        }

        return my3D;

    });