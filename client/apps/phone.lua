RegisterNUICallback( 'CreateCall', function( data, cb )
    actionCb['CreateCall'] = cb
    TriggerServerEvent('mythic_phone:server:CreateCall', securityToken, 'CreateCall', data.number, data.nonStandard)
end)

RegisterNUICallback( 'DeleteCallRecord', function( data, cb )
    actionCb['DeleteCallRecord'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteCallRecord', securityToken, 'DeleteCallRecord', data.id)
end)