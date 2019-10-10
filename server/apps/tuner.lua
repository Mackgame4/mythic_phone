RegisterServerEvent('mythic_base:server:CharacterSpawned')
AddEventHandler('mythic_base:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_tuner WHERE charid = @charid', { ['charid'] = cData.id }, function(dbTunes)
            local tunes = {}
            if dbTunes[1] ~= nil then
                for k, v in pairs(dbTunes) do
                    table.insert(tunes, json.decode(v.data))
                end
            end

            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'factory-tunes', data = Config.FactoryTunes } })
            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'custom-tunes', data = tunes } })
        end)
    end)
end)

AddEventHandler('mythic_base:shared:ComponentsReady', function()
    while Callbacks == nil do
        Citizen.Wait(100)
    end

    Callbacks:RegisterServerCallback('mythic_phone:server:SaveTune', function(source, event, data)

    end)

    Callbacks:RegisterServerCallback('mythic_phone:server:DeleteTune', function(source, event, data)

    end)
end)