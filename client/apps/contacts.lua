local actionCb = nil

RegisterNetEvent('mythic_phone:client:SetupContacts')
AddEventHandler('mythic_phone:client:SetupContacts', function(contacts)
    local data = {}
    SendNUIMessage({
        action = 'setup',
        data = {
            {
                name = 'contacts',
                data = contacts
            },
            {
                name = 'defaultContacts',
                data = Config.DefaultContacts
            }
        }
    })
end)

RegisterNetEvent('mythic_phone:client:ContactActionCallback')
AddEventHandler('mythic_phone:client:ContactActionCallback', function(data)
    if actionCb ~= nil then
        actionCb(data)
        actionCb = nil
    end
end)

RegisterNUICallback( "CreateContact", function( data, cb )
    actionCb = cb
    print(json.encode(data))
    TriggerServerEvent('mythic_phone:server:CreateContact', securityToken, data.name, data.number)
end)

RegisterNUICallback( "EditContact", function( data, cb )
    actionCb = cb
    TriggerServerEvent('mythic_phone:server:EditContact', securityToken, data.id, data.name, data.number)
end)

RegisterNUICallback( "DeleteContact", function( data, cb )
    actionCb = cb
    TriggerServerEvent('mythic_phone:server:DeleteContact', securityToken, data.id)
end)