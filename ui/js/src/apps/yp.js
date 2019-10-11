import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';
import Notif from '../notification';
import Phone from './phone/phone';

var ads = null;

$('#screen-content').on('keyup', '#yp-search input', function (e) {
    e.preventDefault();

    let searchVal = $(this).val().toUpperCase();

    if (searchVal !== '') {
        $.each(
            $(this)
                .parent()
                .parent()
                .find('#yp-body')
                .find('.yp-post'),
            function (index, advert) {
                let data = $(advert).data('advert');

                if (
                    data.author.toUpperCase().includes(searchVal) ||
                    data.phone.includes(searchVal) ||
                    data.title.toUpperCase().includes(searchVal) ||
                    data.message.toUpperCase().includes(searchVal)
                ) {
                    $(advert).fadeIn();
                } else {
                    $(advert).fadeOut();
                }
            }
        );
    } else {
        $.each(
            $(this)
                .parent()
                .parent()
                .find('#yp-body')
                .children(),
            function (index, advert) {
                $(advert).fadeIn();
            }
        );
    }
});

$('#screen-content').on('click', '#yp-body .yp-phone', function (e) {
    if ($(this).html() != Data.GetData('myData').phone) {
        App.OpenApp('phone', null, false);
        Phone.CreateCall($(this).html(), false, false);
    }
});

$('#screen-content').on('click', '#delete-ad', function (e) {
    $.post(Config.ROOT_ADDRESS + '/DeleteAd', JSON.stringify({}), function() {
        $('#yp-body').find('.yp-post-owned').fadeOut('normal', function () {
            $('#yp-body').find('.yp-post-owned').remove();
            Notif.Alert('Advertisement Deleted');
        });
        $('#delete-ad').fadeOut();
    });
});

$('#screen-content').on('submit', '#new-advert', function (e) {
    e.preventDefault();
    let data = $(this).serializeArray();

    let myData = Data.GetData('myData');
    let date = Date.now();
    let title = data[0].value;
    let message = data[1].value;

    $.post(Config.ROOT_ADDRESS + '/NewAd', JSON.stringify({
        date: date,
        title: title,
        message: message,
    }), function () {
        AddAdvert({
            id: myData.id,
            author: myData.name,
            phone: myData.phone,
            date: date,
            title: title,
            message: message
        });

        let modal = M.Modal.getInstance($('#create-advert-modal'));
        modal.close();
        $('#new-advert').trigger('reset');

        $(`#advert-${myData.id}`).addClass('yp-post-owned');
        $('#delete-ad').fadeIn();

        Notif.Alert('Advertisement Posted');
    });
});

function AddAdvert(advert) {
    if ($(`#advert-${advert.id}`).length < 1) {
        $('#yp-body').prepend(`<div class="yp-post" id="advert-${advert.id}"><div class="yp-post-header"><span class="yp-author">${advert.author}</span><span class="yp-phone">${advert.phone}</span></div><div class="yp-post-body"><div class="yp-post-title">${advert.title}</div><div class="yp-post-message">${advert.message}</div></div><div class="yp-post-timestamp">${moment(advert.date).fromNowOrNow()}</div></div>`);
        $('#yp-body .yp-post:first-child').data('advert', advert);
        AddAdvertData(advert);
    } else {
        $(`#advert-${advert.id}`).find('.yp-post-title').html(advert.title);
        $(`#advert-${advert.id}`).find('.yp-post-message').html(advert.message);
        $(`#advert-${advert.id}`).find('.yp-post-timestamp').html(moment(advert.date).fromNowOrNow());
        $(`#advert-${advert.id}`).data('advert', advert);
        $(`#advert-${advert.id}`).parent().prepend($(`#advert-${advert.id}`));
        UpdateAdvertData(advert.id, advert);
    }
}

function AddAdvertData(data) {
    Data.AddData('adverts', data);
}

function UpdateAdvertData(targetId, newData) {
    if (ads == null) {
        ads = Data.GetData('adverts');
    }

    $.each(ads, function(index, data) {
        if (data.id === targetId) {
            Data.UpdateData('adverts', index, newData);
            return;
        }
    });
}

function DeleteAdvertData(id) {
    if (ads == null) {
        ads = Data.GetData('adverts');
    }

    $.each(ads, function(index, data) {
        if (data.id === id) {
            Data.RemoveData('adverts', index);
            return;
        }
    });
}

function ReceiveNewAdvert(advert) {
    AddAdvertData(advert);
    if (App.GetCurrentApp() === 'ads') {
        AddAdvert(advert);
    }
}

function DeleteAdvert(id) {
    if ($(`#advert-${id}`).length < 1) {
        if (App.GetCurrentApp() === 'ads') {
            $(`#advert-${id}`).fadeOut('normal', function() {
                $(`#advert-${id}`).remove();
            });
        } else {
            $(`#advert-${id}`).remove();
        }

        DeleteAdvertData(id);
    }
}

$('#screen-content').on('yp-open-app', function() {
    let phone = Data.GetData('myData').phone;
    ads = Data.GetData('adverts');

    ads.sort(Utils.DateSortOldest);

    $('#yp-body').html('');
    $.each(ads, function (index, advert) {
        AddAdvert(advert);
        if (advert.phone == phone) {
            $('#yp-body .yp-post:first-child').addClass('yp-post-owned');
            $('#delete-ad').show();
        }
    });
});

export default { ReceiveNewAdvert, DeleteAdvert };