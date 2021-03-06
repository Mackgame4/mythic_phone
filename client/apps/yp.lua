RegisterNetEvent('mythic_phone:client:ReceiveAd')
AddEventHandler('mythic_phone:client:ReceiveAd', function(advert)
    if advert.phone ~= CharData.phone then
        SendNUIMessage({
            action = 'ReceiveAd',
            advert = advert
        })
    end
end)

RegisterNetEvent('mythic_phone:client:DeleteAd')
AddEventHandler('mythic_phone:client:DeleteAd', function(id)
    if id ~= CharData.id then
        SendNUIMessage({
            action = 'DeleteAd',
            id = id
        })
    end
end)

RegisterNUICallback( 'NewAd', function( data, cb )
    Callbacks:ServerCallback('mythic_phone:server:NewAd', { title = data.title, message = data.message, date = data.date }, function()
        cb(true)
    end)
end)

RegisterNUICallback( 'DeleteAd', function( data, cb )
    Callbacks:ServerCallback('mythic_phone:server:DeleteAd', {}, function()
        cb(true)
    end)
end)