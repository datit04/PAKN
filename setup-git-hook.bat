@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Content -Path .git\hooks\post-commit -Value ('#!/bin/sh`necho \"==> [CI/CD LOCAL] Phat hien commit moi! Dang tu dong cap nhat ban moi nhat vao Docker...\"`ndocker compose up -d --build frontend backend`necho \"==> [CI/CD LOCAL] Da cap nhat ban moi nhat vao Docker Nginx thanh cong!\"'); Write-Host 'Da cai dat Git Hook thanh cong!' -ForegroundColor Green"
pause
