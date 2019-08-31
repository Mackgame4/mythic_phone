RegisterServerEvent('mythic_base:server:CharacterSpawned')
AddEventHandler('mythic_base:server:CharacterSpawned', function()
    local src = source
    local char = exports['mythic_base']:FetchComponent('Fetch'):Source(src):GetData('character')
    local cData = char:GetData()

    TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'myNumber', data = cData.phone }, { name = 'apps', data = Config.Apps } })
end)