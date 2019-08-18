var editingContact = null;

$('.contacts-list').on('click', '.contact-avatar, .contact-name', function(event) {
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
        number: number,
    }), function(status) {
        console.log(status)
        if (status) {
            var modal = M.Modal.getInstance($('#add-contact-modal'));
            modal.close();

            let contacts = JSON.parse(window.localStorage.getItem('contacts'));

            if (contacts == null) {
                contacts = new Array();
            }

            contacts.push({ name: name, number: number, index: contacts.length });
            window.localStorage.setItem('contacts', JSON.stringify(contacts));
        
            $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ava-' + name[0].toString().toLowerCase() + '">' + name[0] + '</div><div class="contact-name">' + name + ' <span class="number">( ' + number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms"></i><i class="fas fa-user-edit action-edit modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
            $('.contacts-list .contact:last-child').data('contact', { name: name, number: number, id: status, index: contacts.length - 1 });
        
            $('.contacts-list').animate({
                scrollTop: $(".contacts-list .contact:last-child").offset().top
            }, 2000);
            
            $('.contacts-list .contact:last-child').find('.contact-name').trigger('click');
            M.toast({html: 'Contact Added'});

            $('#contact-add-name').val('');
            $('#contact-add-name').next().removeClass('active');
            $('#contact-add-number').val('');
            $('#contact-add-number').next().removeClass('active');

        } else {
            M.toast({html: 'Error Adding Contact'});
        }
    });
});

$('#contacts-edit-contact').on('submit', function(e) {
    e.preventDefault();
    
    let data = $(this).serializeArray();
    let editingData = $(editingContact).data('contact')

    let name = data[0].value;
    let number = data[1].value;

    $.post('http://mythic_phone2/EditContact', JSON.stringify({
        name: name,
        number: number,
        id: editingData.id
    }), function(status) {
        if (status) {
            var modal = M.Modal.getInstance($('#edit-contact-modal'));
            modal.close();

            let contacts = JSON.parse(window.localStorage.getItem('contacts'));
            contacts[oData.index] = { name: name, number: number, id: editingData.id, index: editingData.index };
            window.localStorage.setItem('contacts', JSON.stringify(contacts));

            $(editingContact).html('<div class="contact-avatar ava-' + name[0].toString().toLowerCase() + '">' + name[0] + '</div><div class="contact-name">' + name + ' <span class="number">( ' + number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms"></i><i class="fas fa-user-edit action-edit modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div>')
            $(editingContact).data('contact', { name: name, number: number, id: editingData.id, index: editingData.index })
            
            $(editingContact).find('.contact-name').trigger('click');
            M.toast({html: 'Contact Updated'});

            $('#contact-edit-name').val('');
            $('#contact-edit-name').next().removeClass('active');
            $('#contact-edit-number').val('');
            $('#contact-edit-number').next().removeClass('active');
        } else {
            M.toast({html: 'Error Updating Contact'});
        }
    });
});

$('.contacts-list').on('click', '.contact-actions .action-edit', function(e) {
    let data = $(this).parent().parent().data('contact');

    editingContact = $(this).parent().parent()
    $('#contact-edit-name').val(data.name);
    $('#contact-edit-number').val(data.number);
});

$('.contacts-list').on('click', '.contact-actions .action-delete', function(e) {
    let $elem = $(this)
    let data = $elem.parent().parent().data('contact');
    $.post('http://mythic_phone2/DeleteContact', JSON.stringify({
        id: data.id
    }), function(status) {
        console.log(status);
        if (status) {
            $elem.parent().parent().fadeOut('normal', function() {
                $elem.parent().parent().remove();
            })
            M.toast({html: 'Contact Deleted'});

            let contacts = JSON.parse(window.localStorage.getItem('contacts'));
            contacts.splice(data.index, 1);
            window.localStorage.setItem('contacts', JSON.stringify(contacts));
        } else {
            M.toast({html: 'Error Deleting Contact'});
        }
    });
});

function SetupContacts() {
    let defaultContacts = JSON.parse(window.localStorage.getItem('defaultContacts'));
    let contacts = JSON.parse(window.localStorage.getItem('contacts'));

    $('.contacts-list').html('');
    $.each(defaultContacts, function(index, contact) {
        $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ava-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="contact-name">' + contact.name + ' <span class="number">( ' + contact.number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms action-text"></i><i class="fas fa-user-edit action-disabled"></i><i class="fas fa-trash-alt action-disabled"></i></div></div>');
        $('.contacts-list .contact:last-child').data('contact', contact);
    });

    $.each(contacts, function(index, contact) {
        $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar ava-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="contact-name">' + contact.name + ' <span class="number">( ' + contact.number + ' )</span></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms"></i><i class="fas fa-user-edit action-edit  modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
        contact.index = index;
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