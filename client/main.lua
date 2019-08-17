function hasPhone(cb)
  TriggerEvent('mythic_inventory:client:CheckItemCount', 'phone-check', { { item = 'phone', count = 1 } }, function(hasPhone)
    cb(hasPhone)
  end)
end
  
function hasDecrypt(cb)
  TriggerEvent('mythic_inventory:client:CheckItemCount', 'irc-check', { { item = 'decryptor', count = 1 } }, function(hasDecrypt)
    cb(hasDecrypt)
  end)
end
  
function toggleIrc(status)
  if not status then
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', false)
  else
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', true)
  end
end

function ShowNoPhoneWarning()
  exports['mythic_notify']:SendAlert('error', 'You Don\'t Have a Phone')
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        if IsControlJustReleased(1, 170) then
          SetNuiFocus(true, true)
          SendNUIMessage( { action = 'show' } )
      end
    end
end)

RegisterNUICallback( "ClosePhone", function( data, cb )
  print('close')
    SetNuiFocus(false, false)
end)