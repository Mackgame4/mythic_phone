import App from '../../app';
import Config from '../../config';
import Data from '../../data';
import Notif from '../../notification';

var sliders = {
    boost: document.getElementById('slider-boost'),
    throttle: document.getElementById('slider-throttle'),
    tranny: document.getElementById('slider-tranny'),
    brakes: document.getElementById('slider-brakes'),
    dt: document.getElementById('slider-dt')
}

function InitSliders() {
    for (let key in sliders) {
        let slider = sliders[key];
        noUiSlider.create(slider, {
            start: [50],
            connect: [true, false],
            step: 10,
            orientation: 'horizontal',
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
}

$('#screen-content').on('submit', '#new-tune', function(e) {
    e.preventDefault();
    let data = $(this).serializeArray();
    let tunes = Data.GetData('custom-tunes');

    $.post(Config.ROOT_ADDRESS + 'TunerNew', JSON.stringify({
        label: data[0].value,
        carOnly: data[1] != null ? true : false,
        carModel: null,
        boost: sliders.boost.noUiSlider.get(),
        throttle: sliders.throttle.noUiSlider.get(),
        tranny: sliders.tranny.noUiSlider.get(),
        brakes: sliders.brakes.noUiSlider.get(),
        dt: sliders.dt.noUiSlider.get()
    }), function(tune) {
        if (tune != null) {
            Data.AddData('custom-tunes', tune);
            Notif.Alert('Tune Saved');
            let modal = M.Modal.getInstance($('#save-tune-popup'));
            modal.close();
        } else {
            Notif.Alert('Error Saving Tune');
        }
    });
})

$('#screen-content').on('click', '#tuner-custom-saved', function() {
    //App.OpenApp('tuner-saved', null, false, true);

    let tunes = Data.GetData('custom-tunes');
    let factory = Data.GetData('factory-tunes');
    $('#custom-tunes-popup').find('#car-only').html('');
    $('#custom-tunes-popup').find('#generic').html('');

    let testModel = 'RUINER'; // TODO : Update to pull current car model
    let carOnly = tunes.filter(function(tune) {
        return tune.carOnly && tune.carModel === testModel;
    });

    let generic = tunes.filter(function(tune) {
        return !tune.carOnly;
    });

    if (carOnly.length > 0) {
        CreateSavedTuneList($('#custom-tunes-popup').find('#car-only'), carOnly);
    } else {
        $('#tab-car-only').removeClass('active');
        $('#tab-generic').addClass('active');
        let tabs = M.Tabs.getInstance($('#custom-tunes-tabs'));
        tabs.updateTabIndicator();
    }

    CreateSavedTuneList($('#custom-tunes-popup').find('#generic'), factory, true);
    CreateSavedTuneList($('#custom-tunes-popup').find('#generic'), generic);

    let modal = M.Modal.getInstance($('#custom-tunes-popup'));
    modal.open();
});

$('#screen-content').on('click', '#custom-tunes-popup .quick-tune-button', function(e) {
    let tune = $(this).data('tune');
    sliders.boost.noUiSlider.set(tune.boost);
    sliders.throttle.noUiSlider.set(tune.throttle);
    sliders.tranny.noUiSlider.set(tune.tranny);
    sliders.brakes.noUiSlider.set(tune.brakes);
    sliders.dt.noUiSlider.set(tune.dt);

    Notif.Alert('Tune Loaded, Press Apply To Apply It');

    let modal = M.Modal.getInstance($('#custom-tunes-popup'));
    modal.close();
});

$('#screen-content').on('click', '#custom-tunes-popup .quick-tune-delete', function(e) {
    let tune = $(this).parent().find('.quick-tune-button').data('tune');

    $.post(Config.ROOT_ADDRESS + '/TunerDelete', JSON.stringify({
        id: tune.id
    }), function(status) {
        if (status) {
            Data.RemoveObjectData('custom-tunes', 'id', tune.id);
            $(this).parent().fadeOut('fast', function() {
                $(this).remove();
            });
            Notif.Alert('Tune Deleted');
        } else {

        }
    })
});

$('#screen-content').on('click', '#tuner-custom-quick', function() {
    App.OpenApp('tuner-quick', null, false, true);
});

$('#screen-content').on('click', '#tuner-custom-apply', function() {
    ApplyTune();
});

function CreateSavedTuneList(element, tunes, removeDelete = false) {
    $.each(tunes, function(index, tune) {
        element.append(`
            <div class="tuner-options">
                <button type="button" class="btn waves-effect waves-light teal darken-4 quick-tune-button">${tune.label}</button>
                <button type="button" class="btn waves-effect waves-light materialize-red darken-4 quick-tune-delete${removeDelete ? ' disabled' : ''}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `);

        element.find('.tuner-options:last-child .quick-tune-button').data('tune', tune);
    });
}

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
            Notif.Alert('Tune Applied');
        } else {
            Notif.Alert('Unable To Apply Tune');
        }
    });
}

$('#screen-content').on('tuner-custom-open-app', function(tune) {
    sliders = {
        boost: document.getElementById('slider-boost'),
        throttle: document.getElementById('slider-throttle'),
        tranny: document.getElementById('slider-tranny'),
        brakes: document.getElementById('slider-brakes'),
        dt: document.getElementById('slider-dt')
    }

    InitSliders();

    if (tune != null) {
        console.log('woot');
    }

    $('#tuner-custom-container .inner-app').fadeIn();
});

$('#screen-content').on('tuner-custom-close-app', function() {
    $('#tuner-custom-container .inner-app').fadeOut();
});