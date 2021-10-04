@echo off

if exist node_modules (
    if exist bin\node.exe (
        bin\node.exe start.js
    ) else (
        echo Cannot find node.exe file please reinstall BlueBird
    )
) else (
    bin\npm.cmd install
    if exist bin\node.exe (
        bin\node.exe start.js
    ) else (
        echo Cannot find node.exe file please reinstall BlueBird
    )
)