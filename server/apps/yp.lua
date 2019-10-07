local Advertisements = {}

RegisterServerEvent('mythic_base:server:CharacterSpawned')
AddEventHandler('mythic_base:server:CharacterSpawned', function()
    TriggerClientEvent('mythic_phone:client:SetupData', source, { { name = 'adverts', data = Advertisements } })
end)

AddEventHandler('mythic_base:shared:ComponentsReady', function()
    while Callbacks == nil do
        Citizen.Wait(100)
    end

    Callbacks:RegisterServerCallback('mythic_phone:server:NewAd', function(source, event, data)
        local char = exports['mythic_base']:FetchComponent('Fetch'):Source(source):GetData('character')
        local id = char:GetData('id')

        Advertisements[id] = {
            id = id,
            author = char:getFullName(),
            number = char:GetData('phone'),
            date = data.date,
            title = data.title,
            message = data.message
        }

        TriggerClientEvent('mythic_phone:client:ReceiveAd', -1, Advertisements[id])
        return
    end)

    Callbacks:RegisterServerCallback('mythic_phone:server:DeleteAd', function(source, event, data)
        local char = exports['mythic_base']:FetchComponent('Fetch'):Source(source):GetData('character')
        local id = char:GetData('id')
        Advertisements[id] = nil
        TriggerClientEvent('mythic_phone:client:DeleteAd', -1, id)
        return
    end)
end)