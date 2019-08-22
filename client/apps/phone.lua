

RegisterNUICallback( 'DeleteCallRecord', function( data, cb )
    print('DeleteCallRecord')
    actionCb['DeleteCallRecord'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteCallHistory', securityToken, 'DeleteCallRecord', data.id)
end)