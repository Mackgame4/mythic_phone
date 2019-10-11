import Data from './data';

window.addEventListener('message', function(event) {
    switch (event.data.action) {
        case 'setmute':
            SetMute(event.data.muted);
            break;
        case 'updateTime':
            UpdateClock(event.data.time);
            break;
    }
});

function DateSortNewest(a, b) {
    if (a.time != null) {
        return a.time < b.time ? 1 : -1;
    } else {
        return a.date < b.date ? 1 : -1;
    }
}

function DateSortOldest(a, b) {
    if (a.time != null) {
        return a.time > b.time ? 1 : -1;
    } else {
        return a.date > b.date ? 1 : -1;
    }
}

function UpdateClock(time) {
    $('.time span').html(time);
}

function NotifyAltSim(status) {
    if (status) {
        $('.simcard').fadeIn();
    } else {
        $('.simcard').fadeOut();
    }
}

function NotifyPayphone(status) {
    if (status) {
        $('.payphone').fadeIn();
    } else {
        $('.payphone').fadeOut();
    }
}

function SetMute(status) {
    if (status) {
        $('.mute').html('<i class="fas fa-volume-mute"></i>');
        $('.mute')
            .removeClass('not-muted')
            .addClass('muted');
        Data.StoreData('muted', true);
    } else {
        $('.mute').html('<i class="fas fa-volume-up"></i>');
        $('.mute')
            .removeClass('muted')
            .addClass('not-muted');
        Data.StoreData('muted', false);
    }
}

export default {
    DateSortNewest,
    DateSortOldest,
    UpdateClock,
    NotifyAltSim,
    NotifyPayphone,
    SetMute
};
