Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "[PAKN CI/CD LOCAL] DANG CAP NHAT VA BUILD DOCKER NGINX..." -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan

# Kiem tra Docker Desktop da chay chua
$dockerCheck = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[LOI] Docker Desktop chua san sang hoac dang khoi dong!" -ForegroundColor Red
    Write-Host "-> Hay mo Docker Desktop va doi den khi bieu tuong chu ca voi chuyen sang mau xanh (Docker Engine is running)." -ForegroundColor Yellow
    Write-Host "-> Sau do chay lai file nay." -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker Engine dang hoat dong. Dang build va chay he thong..." -ForegroundColor Green
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[LOI] Qua trinh docker compose gap su co khi build/chay container." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "=======================================================================" -ForegroundColor Green
Write-Host "      DA CAP NHAT HE THONG DOCKER NGINX MOI NHAT THANH CONG!          " -ForegroundColor Green
Write-Host "=======================================================================" -ForegroundColor Green
Write-Host ""

$ips = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and 
    $_.IPAddress -notlike "172.*" 
} | Select-Object -ExpandProperty IPAddress

Write-Host ">> GUI LINK NAY CHO SEP HOAC CAC MAY TRONG CUNG MANG LAN/WI-FI:" -ForegroundColor Cyan
foreach ($ip in $ips) {
    Write-Host "   👉 Link Web:     http://$ip" -ForegroundColor Yellow
    Write-Host "   👉 Swagger API:  http://$ip/swagger" -ForegroundColor Gray
}
Write-Host ""

