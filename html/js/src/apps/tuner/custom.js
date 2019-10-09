import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';

$(function() {
    var sliders = $('.tuner-slider');
    $.each(sliders, function(index, slider) {
        noUiSlider.create(slider, {
            start: [50],
            connect: [true, false],
            step: 10,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': 0,
                'max': 100
            },
            pips: {
                mode: 'steps',
                stepped: true,
                density: 10
            }
        });
    });
});

$('#tuner-custom-quick').on('click', function() {
    App.OpenApp('tuner-quick', null, false, true);
});

function OpenApp() {
    $('#tuner-custom-container .inner-app').fadeIn();
}

function CloseApp() {
    $('#tuner-custom-container .inner-app').fadeOut();
}

export default { OpenApp, CloseApp }