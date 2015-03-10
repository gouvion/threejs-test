define(['jquery', 'modernizr'], function ($, Modernizr) {
    return {

        defaultTest: ["canvas", "webgl"],

        getMessage: function (tests) {
            var _self = this;
            var message = '';
            if ($.isArray(tests)) {
                $.each(tests, function (index, value) {
                    if ($.inArray(value, _self.defaultTest) > -1) {
                        message += _self[value+'Message']() + '<br />';
                    }
                });
            } else {
                $.each(this.defaultTest, function (index, value) {
                    message += _self[value+'Message']() + '<br />';
                    ;
                });
            }

            return message;
        },

        canvasMessage: function () {
            if (this.isCanvasCompliant()) {
                return 'Your browser support Canvas buddy !';
            } else {
                return 'Your browser does not support Canvas buddy !';
            }
        },

        webglMessage: function () {
            if (this.isWebglCompliant()) {
                return 'Your browser support WebGl buddy !';
            } else {
                return 'Your browser does not support WebGl buddy !';
            }
        },

        isCanvasCompliant: function () {
            return Modernizr.canvas;
        },

        isWebglCompliant: function () {
            return Modernizr.webgl;
        }

    }
});