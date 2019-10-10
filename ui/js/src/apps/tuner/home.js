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

$('#screen-content').on('click', '.tuner-nav', function(e) {
    if ($(this).data('disabled')) return;

    let app = $(this).data('section');
    App.OpenApp(`tuner-${app}`, null, false, true);
});

$('#screen-content').on('click', '#no-chip-quit', function() {
    App.GoBack();
});

function ShowError() {
    $('.no-chip-error').show('scale', function() {
        $('.tuner-nav').data('disabled', true);
    });
}

function SetupTuner(tunerActive) {
    hasScanned = true;
    if (Data.GetData('currentVeh') == null || Data.GetData('currentVeh').id != tunerActive.id) {
        Data.StoreData('currentVeh', tunerActive);
    }

    $('#tuner-home-screen').fadeIn('normal');
}

function ResetScan() {
    hasScanned = false;
}

function OpenApp() {
    if (!hasScanned) {
        $.post(Config.ROOT_ADDRESS + '/SetupTuner', JSON.stringify({}), 
        function(status) {
            if (status) {
                SetupTuner(status);
            } else {
                ShowError();
            }
        });
    } else {
        $.post(Config.ROOT_ADDRESS + '/CheckInVeh', JSON.stringify({
            veh: Data.GetData('currentVeh')
        }), function(status) {
            if (status != null) {
                if (status.sameVeh) {
                    SetupTuner(status);
                } else if(status) {
                    $.post(Config.ROOT_ADDRESS + '/SetupTuner', JSON.stringify({}), 
                    function(status) {
                        if (status) {
                            SetupTuner(status);
                        } else {
                            ShowError();
                        }
                    });
                } else {
                    ShowError();
                }
            } else {

            }
        });
    }
}

function CloseApp() {
    clearTimeout(timer);
    $('.no-chip-error').hide();
    $('#tuner-home-screen').hide();
    $('.tuner-nav').removeData('disabled');
}

export default { OpenApp, CloseApp, Quick, Custom, Legal }