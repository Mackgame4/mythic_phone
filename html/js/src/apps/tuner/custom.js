import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';
import Saved from './saved';

var sliders = {
    boost: document.getElementById('slider-boost'),
    throttle: document.getElementById('slider-throttle'),
    tranny: document.getElementById('slider-tranny'),
    brakes: document.getElementById('slider-brakes'),
    dt: document.getElementById('slider-dt')
}

$(function() {
    for (let key in sliders) {
        let slider = sliders[key];
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
    }
});

$('#new-tune').on('submit', function(e) {
    e.preventDefault();
    let data = $(this).serializeArray();
    let tune = {
        label: data[0].value,
        carOnly: data[1].value === "on" ? true : false,
        carModel: null,
        boost: sliders.boost.noUiSlider.get(),
        throttle: sliders.throttle.noUiSlider.get(),
        tranny: sliders.tranny.noUiSlider.get(),
        brakes: sliders.brakes.noUiSlider.get(),
        dt: sliders.dt.noUiSlider.get()
    }

    Data.AddData('custom-tunes', {
        id: tunes[tunes.length - 1].id + 1,
        label: tune.label,
        carOnly: tune.carOnly,
        carModel: tune.carModel,
        boost: tune.boost,
        throttle: tune.throttle,
        tranny: tune.tranny,
        brakes: tune.brakes,
        dt: tune.dt
    });

    let modal = M.Modal.getInstance($('#save-tune-popup'));
    modal.close();
})

$('#tuner-custom-saved').on('click', function() {
    //App.OpenApp('tuner-saved', null, false, true);

    let tunes = Data.GetData('custom-tunes');
    $('#custom-tunes-popup').find('.modal-content').html('');
    $('#custom-tunes-popup').find('.modal-content').append('<h5>Your Saved Tunes</h5>');
    $.each(tunes, function(index, tune) {
        $('#custom-tunes-popup').find('.modal-content').append(`
            <div class="tuner-options">
                <button type="button" class="btn waves-effect waves-light teal darken-4 quick-tune-button">${tune.label}</button>
                <button type="button" class="btn waves-effect waves-light materialize-red darken-4 quick-tune-delete"><i class="fas fa-trash-alt"></i></button>
            </div>
        `);

        $('#custom-tunes-popup .tuner-options:last-child').find('.quick-tune-button').data('tune', tune);
    });

    let modal = M.Modal.getInstance($('#custom-tunes-popup'));
    modal.open();
});

$('#custom-tunes-popup').on('click', '.quick-tune-button', function(e) {
    let tune = $(this).data('tune');
    console.log(tune);
    sliders.boost.noUiSlider.set(tune.boost);
    sliders.throttle.noUiSlider.set(tune.throttle);
    sliders.tranny.noUiSlider.set(tune.tranny);
    sliders.brakes.noUiSlider.set(tune.brakes);
    sliders.dt.noUiSlider.set(tune.dt);

    M.toast({ html: 'Tune Loaded, Press Apply To Apply It' });

    let modal = M.Modal.getInstance($('#custom-tunes-popup'));
    modal.close();
})

$('#tuner-custom-quick').on('click', function() {
    App.OpenApp('tuner-quick', null, false, true);
});

$('#tuner-custom-apply').on('click', function() {
    ApplyTune();
});

function ApplyTune(tune) {
    let boost = sliders.boost.noUiSlider.get();
    let throttle = sliders.throttle.noUiSlider.get();
    let tranny = sliders.tranny.noUiSlider.get();
    let brakes = sliders.brakes.noUiSlider.get();
    let dt = sliders.dt.noUiSlider.get();

    if (tune != null) {
        boost = tune.boost;
        throttle = tune.throttle;
        tranny = tune.tranny;
        brakes = tune.brakes;
        dt = tune.dt;
    }

    $.post(Config.ROOT_ADDRESS + '/ApplyTune', JSON.stringify({
        boost: boost,
        throttle: throttle,
        tranny: tranny,
        brakes: brakes,
        dt: dt
    }), function(status) {
        if (status) {
            M.toast({ html: 'Tune Applied' });
        } else {
            M.toast({ html: 'Unable To Apply Tune' });
        }
    });
}

function OpenApp(tune) {
    if (tune != null) {
        console.log('woot');
    }

    $('#tuner-custom-container .inner-app').fadeIn();
}

function CloseApp() {
    $('#tuner-custom-container .inner-app').fadeOut();
}

export default { OpenApp, CloseApp }