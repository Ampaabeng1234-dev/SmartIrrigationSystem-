# PowerShell script to find and kill the process using port 5001

$port = 5001
Write-Host "Checking for process using port $port..."

# Get the PID of the process using the port
$pid = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess

if ($pid) {
    Write-Host "Process with PID $pid is using port $port. Attempting to stop it..."
    Stop-Process -Id $pid -Force
    Write-Host "Process $pid stopped successfully."
} else {
    Write-Host "No process is using port $port."
}
