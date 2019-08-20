actionCb = {}
local isPhoneOpen = false

RegisterNetEvent('mythic_phone:client:ActionCallback')
AddEventHandler('mythic_phone:client:ActionCallback', function(identifier, data)
    if actionCb[identifier] ~= nil then
        actionCb[identifier](data)
        actionCb[identifier] = nil
    end
end)

RegisterNetEvent('mythic_phone:client:SetupData')
AddEventHandler('mythic_phone:client:SetupData', function(data)
  print(json.encode(data))
  SendNUIMessage({
    action = 'setup',
    data = data
  })
end)

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
        TogglePhone()
      end
    end
end)



function TogglePhone()
  if not openingCd or isPhoneOpen then
    isPhoneOpen = not isPhoneOpen
    SetNuiFocus(isPhoneOpen, isPhoneOpen)
    if isPhoneOpen == true then 
      PhonePlayIn()
      SendNUIMessage( { action = 'show' } )
      DisableControls()
    else
      PhonePlayOut()
      SendNUIMessage( { action = 'hide' } )
    end

    openingCd = true
  end

  Citizen.CreateThread(function()
    Citizen.Wait(2000)
    openingCd = false
  end)
end

function DisableControls()
  Citizen.CreateThread(function()
      while isPhoneOpen do
          DisableControlAction(0, 1, true) -- LookLeftRight
          DisableControlAction(0, 2, true) -- LookUpDown
          DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
          DisableControlAction(0, 30, true) -- disable left/right
          DisableControlAction(0, 31, true) -- disable forward/back
          DisableControlAction(0, 36, true) -- INPUT_DUCK
          DisableControlAction(0, 21, true) -- disable sprint
          DisableControlAction(0, 63, true) -- veh turn left
          DisableControlAction(0, 64, true) -- veh turn right
          DisableControlAction(0, 71, true) -- veh forward
          DisableControlAction(0, 72, true) -- veh backwards
          DisableControlAction(0, 75, true) -- disable exit vehicle

          DisablePlayerFiring(PlayerId(), true) -- Disable weapon firing
          DisableControlAction(0, 24, true) -- disable attack
          DisableControlAction(0, 25, true) -- disable aim
          DisableControlAction(1, 37, true) -- disable weapon select
          DisableControlAction(0, 47, true) -- disable weapon
          DisableControlAction(0, 58, true) -- disable weapon
          DisableControlAction(0, 140, true) -- disable melee
          DisableControlAction(0, 141, true) -- disable melee
          DisableControlAction(0, 142, true) -- disable melee
          DisableControlAction(0, 143, true) -- disable melee
          DisableControlAction(0, 263, true) -- disable melee
          DisableControlAction(0, 264, true) -- disable melee
          DisableControlAction(0, 257, true) -- disable melee
          Citizen.Wait(1)
      end
  end)
end

RegisterNUICallback( "ClosePhone", function( data, cb )
  TogglePhone()
end)