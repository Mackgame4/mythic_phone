Call = {}

RegisterNetEvent('mythic_phone:client:CreateCall')
AddEventHandler('mythic_phone:client:CreateCall', function(number)
    Call.number = number
    Call.status = 0

    local count = 0
    Citizen.CreateThread(function()
        while Call.status == 0 do
            if count >= 30 then
                TriggerServerEvent('mythic_phone:server:EndCall', securityToken)
                Call = {}
            else
                count = count + 1
            end
            Citizen.Wait(1000)
        end
    end)
end)

RegisterNetEvent('mythic_phone:client:AcceptCall')
AddEventHandler('mythic_phone:client:AcceptCall', function(channel, initiator)
    print('lolfuckmelifem8y')
    if Call.number ~= nil and Call.status == 0 then
        Call.status = 1

        if initiator then
            SendNUIMessage({
                action = 'acceptCallSender',
                number = Call.number
            })
        else
            exports['mythic_notify']:PersistentAlert('end', 'incoming-call')
            SendNUIMessage({
                action = 'acceptCallReceiver',
                number = Call.number
            })
        end
    end
end)

RegisterNetEvent('mythic_phone:client:EndCall')
AddEventHandler('mythic_phone:client:EndCall', function()
    SendNUIMessage({
        action = 'endCall'
    })
    exports['mythic_notify']:PersistentAlert('end', 'incoming-call')
    Call = {}
end)

RegisterNetEvent('mythic_phone:client:ReceiveCall')
AddEventHandler('mythic_phone:client:ReceiveCall', function(number)
    Call.number = number
    Call.status = 0

    SendNUIMessage({
        action = 'receiveCall',
        number = number
    })

    local count = 0
    Citizen.CreateThread(function()
        while Call.status == 0 do
            if count >= 30 then
                TriggerServerEvent('mythic_phone:server:EndCall', securityToken)
                Call = {}
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

RegisterNUICallback( 'AcceptCall', function( data, cb )
    print('please?')
    TriggerServerEvent('mythic_phone:server:AcceptCall', securityToken)
end)

RegisterNUICallback( 'EndCall', function( data, cb )
    TriggerServerEvent('mythic_phone:server:EndCall', securityToken)
end)

RegisterNUICallback( 'DeleteCallRecord', function( data, cb )
    actionCb['DeleteCallRecord'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteCallRecord', securityToken, 'DeleteCallRecord', data.id)
end)