PendingCall = {}

RegisterNetEvent('mythic_phone:client:AcceptCall')
AddEventHandler('mythic_phone:client:AcceptCall', function(channel, number)

end)

RegisterNetEvent('mythic_phone:client:EndCall')
AddEventHandler('mythic_phone:client:EndCall', function(status)
    SendNUIMessage({
        action = 'endCall',
        status = status
    });
    PendingCall = {}
end)

RegisterNetEvent('mythic_phone:client:RejectCall')
AddEventHandler('mythic_phone:client:RejectCall', function(status)
    SendNUIMessage({
        action = 'rejectCall'
    });
    exports['mythic_notify']:PersistentAlert('end', 'incoming-call')
    PendingCall = {}
end)

RegisterNetEvent('mythic_phone:client:ReceiveCall')
AddEventHandler('mythic_phone:client:ReceiveCall', function(caller, number)
    PendingCall.caller = caller
    PendingCall.number = number

    SendNUIMessage({
        action = 'receiveCall',
        number = number
    });

    local count = 0
    Citizen.CreateThread(function()
        while PendingCall.number ~= nil do
            if count >= 30 then
                TriggerServerEvent('mythic_phone:server:RejectCall', securityToken, 'RejectCall', PendingCall.number)
                PendingCall = {}
            else
                count = count + 1
            end
            Citizen.Wait(1000)
        end
    end)
end)


RegisterNUICallback( 'CreateCall', function( data, cb )
    actionCb['CreateCall'] = cb
    TriggerServerEvent('mythic_phone:server:CreateCall', securityToken, 'CreateCall', data.number, data.nonStandard)
end)

RegisterNUICallback( 'RejectCall', function( data, cb )
    actionCb['RejectCall'] = cb
    TriggerServerEvent('mythic_phone:server:RejectCall', securityToken, 'RejectCall', PendingCall.number)
end)

RegisterNUICallback( 'DeleteCallRecord', function( data, cb )
    actionCb['DeleteCallRecord'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteCallRecord', securityToken, 'DeleteCallRecord', data.id)
end)