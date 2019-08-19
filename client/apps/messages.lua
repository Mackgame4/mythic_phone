RegisterNUICallback( 'SendText', function( data, cb )
    actionCb['SendText'] = cb
    TriggerServerEvent('mythic_phone:server:SendText', securityToken, 'SendText', data.receiver, data.message)
end)

RegisterNUICallback( 'DeleteConversation', function( data, cb )
    actionCb['DeleteConversation'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteConversation', securityToken, 'DeleteConversation', data.number)
end)