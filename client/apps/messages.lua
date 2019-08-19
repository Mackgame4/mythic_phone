RegisterNUICallback( 'SendText', function( data, cb )
    actionCb['SendText'] = cb

    print(json.encode(data))

    TriggerServerEvent('mythic_phone:server:SendText', securityToken, 'SendText', data.receiver, data.message)
end)