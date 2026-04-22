@echo off
:: Cross-platform hook dispatcher for Hyperstack
:: Usage: run-hook.cmd <hook-name>
bash "%~dp0%~1" %2 %3 %4 %5
