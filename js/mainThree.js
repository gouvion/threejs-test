requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    },
    shim: {
        'bootstrap': { deps: ['jquery']},
        'modernizr': { exports: 'Modernizr' },
        '3D/three': { deps: ['3D/ThreexFullscreen'], exports: 'THREE' },
        '3D/controls/OrbitControls': { deps: ['3D/three'], exports: 'THREE' },
        '3D/Detector': { exports: 'Detector' },
        '3D/stats': { exports: 'Stats' },
        '3D/datgui': { exports: 'dat.gui' }
    }
});

// Start the main app logic.
requirejs(['jquery', 'bootstrap', 'modernizr', '3D/three', 'app/my3D', 'app/compliance'],
    function ($, bootstrap, Modernizr, THREE, My3D, compliance) {

        // When jQuery is loaded
        $(function () {

            // Display compliance message
            $('#flashMessage').html("<div style='color:white;background:#4444ff'>" + compliance.getMessage() + "</div>");

            $('#3dModal').on('shown.bs.modal', function (e) {

                    My3D.initialize();

                    // display javascript errors
                    window.onerror = function (error) {
                        My3D.displayMessage(error);
                    };

                    // display requirejs errors
                    if (My3D) {
                        requirejs.onError = function (error) {
                            My3D.displayMessage(error);
                        };
                    }


            });

        });
    });