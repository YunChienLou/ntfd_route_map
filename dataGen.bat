echo off
:::
:::
:::
::: $$\   $$\$$$$$$$$\ $$$$$$$$\ $$$$$$$\       $$$$$$$\                       $$\                    $$\      $$\                     
::: $$$\  $$ \__$$  __|$$  _____|$$  __$$\      $$  __$$\                      $$ |                   $$$\    $$$ |                    
::: $$$$\ $$ |  $$ |   $$ |      $$ |  $$ |     $$ |  $$ | $$$$$$\  $$\   $$\$$$$$$\   $$$$$$\        $$$$\  $$$$ | $$$$$$\   $$$$$$\  
::: $$ $$\$$ |  $$ |   $$$$$\    $$ |  $$ |     $$$$$$$  |$$  __$$\ $$ |  $$ \_$$  _| $$  __$$\       $$\$$\$$ $$ | \____$$\ $$  __$$\ 
::: $$ \$$$$ |  $$ |   $$  __|   $$ |  $$ |     $$  __$$< $$ /  $$ |$$ |  $$ | $$ |   $$$$$$$$ |      $$ \$$$  $$ | $$$$$$$ |$$ /  $$ |
::: $$ |\$$$ |  $$ |   $$ |      $$ |  $$ |     $$ |  $$ |$$ |  $$ |$$ |  $$ | $$ |$$\$$   ____|      $$ |\$  /$$ |$$  __$$ |$$ |  $$ |
::: $$ | \$$ |  $$ |   $$ |      $$$$$$$  |     $$ |  $$ |\$$$$$$  |\$$$$$$  | \$$$$  \$$$$$$$\       $$ | \_/ $$ |\$$$$$$$ |$$$$$$$  |
::: \__|  \__|  \__|   \__|      \_______/$$$$$$\__|  \__| \______/  \______/   \____/ \_______|$$$$$$\__|     \__| \_______|$$  ____/ 
:::                                      \______|                                              \______|                     $$ |      
:::                                                                                                                         $$ |      
:::                                                                                                                         \__|      

for /f "delims=: tokens=*" %%A in ('findstr /b ::: "%~f0"') do @echo(%%A

cd ./src
echo running at %cd%
@REM node dataFormator.js
@REM echo complete gen test file , ready to draw map.
node uploadRecorder.js
cd ../

echo complete update at %time%
