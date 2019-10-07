AddEventHandler('mythic_base:shared:ComponentsReady', function()
    exports['mythic_base']:FetchComponent('Chat'):RegisterCommand('phone', function(source)
        TriggerClientEvent('mythic_phone:client:TogglePhone', source)
    end, {
        help = "Toggle Phone Display"
    }, 0)
end)