var defaultContacts = [
    {
        'name': 'Police',
        'number': 'police'
    },
    {
        'name': 'EMS',
        'number': 'ems'
    },
    {
        'name': 'Lawyer',
        'number': 'lawyer'
    },
    {
        'name': 'Real Estate Agent',
        'number': 'realestate'
    },
    {
        'name': 'Mechanic',
        'number': 'mechanic'
    },
    {
        'name': 'Tow Truck',
        'number': 'towtruck'
    },
    {
        'name': 'Taxi',
        'number': 'taxi'
    }
]

$('.contacts-list').on('click', '.contact-avatar, .contact-name', function(event) {
    console.log($(this).parent().data('contact'));

    if ($(this).parent().find('.contact-actions').is(":visible")) {
        $(this).parent().find('.contact-actions').slideUp();
    } else {
        $(this).parent().find('.contact-actions').slideDown();
    }
});

$('#search-contacts').keyup(function(e) {
    e.preventDefault();
    
    let searchVal = $(this).val();

    if (searchVal !== '') {
        $.each($(this).parent().parent().find('.contacts-list').children(), function(index, contact) {
            let data = $(contact).data('contact');
    
            if (data.name.toUpperCase().includes(searchVal.toUpperCase()) || data.number.includes(searchVal.toUpperCase())) {
                $(contact).fadeIn();
            } else {
                $(contact).fadeOut();
            }
        });
    } else {
        $.each($(this).parent().parent().find('.contacts-list').children(), function(index, contact) {
            $(contact).fadeIn();
        });
    }
});

$("#contact-add-number").keyup(function() {
    $(this).val($(this).val().replace(/^(\d{3})(\d{3})(\d)+$/, "$1-$2-$3"));
});

$('#contacts-add-contact').on('submit', function(e) {
    e.preventDefault();
    
    let data = $(this).serializeArray();

    let name = data[0].value;
    let number = data[1].value;

    $.post('http://mythic_phone2/CreateContact', JSON.stringify({
        name: name,
        number: number
    }), function(status) {
        if (status) {
            var modal = M.Modal.getInstance($('#add-contact-modal'));
            modal.close();
        
            $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ' + name[0].toString().toLowerCase() + '">' + name[0] + '</div><div class="contact-name">' + name + ' <span class="number">( ' + number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
            $('.contacts-list .contact:last-child').data('contact', { name: name, number: number });
        
            $('.contacts-list').animate({
                scrollTop: $(".contacts-list .contact:last-child").offset().top
            }, 2000);
            
            $('.contacts-list .contact:last-child').find('.contact-name').trigger('click');
            M.toast({html: 'Contact Added'});
        } else {
            M.toast({html: 'Error Adding Contact'});
        }
    });
});

$('.contacts-list').on('click', '.contact-actions .action-delete', function(e) {
    let data = $(this).parent().parent().data('contact');
    console.log(data);
    $.post('http://mythic_phone2/DeleteContact', JSON.stringify({
        number: data.number
    }), function(status) {
        if (status) {
            $(this).parent().parent().remove();
            M.toast({html: 'Contact Deleted'});
        } else {
            M.toast({html: 'Error Deleting Contact'});
        }
    });
});

function SetupContacts(contacts) {
    $('.contacts-list').html('');
    $.each(defaultContacts, function(index, contact) {
        $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="contact-name">' + contact.name + ' <span class="number">( ' + contact.number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms action-text"></i><i class="fas fa-trash-alt action-disabled"></i></div></div>');
        $('.contacts-list .contact:last-child').data('contact', contact);
    });

    $.each(contacts, function(index, contact) {
        $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="contact-name">' + contact.name + ' <span class="number">( ' + contact.number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
        $('.contacts-list .contact:last-child').data('contact', contact);
    });
}

$(document).ready(function(){
    $('.modal').modal();
});

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}