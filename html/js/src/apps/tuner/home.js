import App from '../../app';
import Config from '../../config';
import Data from '../../data';
import Quick from './quick';
import Custom from './custom';
import Legal from './legal';
import anime from 'animejs/lib/anime.es.js';

var timer = null;
var hasScanned = false;

window.addEventListener('message', function(event) {
    switch (event.data.action) {
        case 'ResetVehicle':
            ResetScan();
            break;
    }
});

$('.tuner-nav').on('click', function(e) {
    if ($(this).data('disabled')) return;

    let app = $(this).data('section');
    App.OpenApp(`tuner-${app}`, null, false, true);
});

$('#no-chip-quit').on('click', function() {
    App.GoBack();
});

function ShowError() {
    console.log('error?');
    $('.no-chip-error').show('scale', function() {
        $('.tuner-nav').data('disabled', true);
    });
}

function SetupTuner(tunerActive) {
    print(tunerActive);
    print(tunerActive == null);
    if (tunerActive == null) {
        ShowError();
    } else {
        hasScanned = true;
        if (Data.GetData('currentVeh') == null || Data.GetData('currentVeh').id != tunerActive.id) {
            Data.StoreData('currentVeh', tunerActive);
        }

        $('#tuner-home-screen').fadeIn('normal');
    }
}

function ResetScan() {
    hasScanned = false;
}

function OpenApp() {
    if (!hasScanned) {
        $.post(Config.ROOT_ADDRESS + '/SetupTuner', JSON.stringify({}), 
        function(status) {
            ShowError();
            SetupTuner(status);
        });
    } else {
        $.post(Config.ROOT_ADDRESS + '/CheckInVeh', JSON.stringify({
            veh: Data.GetData('currentVeh')
        }), function(status) {
            if (status != null) {
                if (status.sameVeh) {
                    SetupTuner(status);
                } else {
                    $.post(Config.ROOT_ADDRESS + '/SetupTuner', JSON.stringify({}), 
                    function(status) {
                        SetupTuner(status);
                    });
                }
            } else {

            }
        });
    }
}

function CloseApp() {
    clearTimeout(timer);
    $('#tuner-home-screen').hide();
    $('.no-chip-error').hide();
    $('.tuner-nav').removeData('disabled');
}

export default { OpenApp, CloseApp, Quick, Custom, Legal }