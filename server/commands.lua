Citizen.CreateThread(function()
    Citizen.Wait(1000)
    
    exports['mythic_chat']:AddChatCommand('phone', function(source)
        TriggerClientEvent('mythic_phone:client:TogglePhone', source)
    end, {
        help = "Toggle Phone Display"
    }, 0)
end)