# Watchdog Script — 对话活跃度监控
# 用法: powershell -ExecutionPolicy Bypass -File watchdog.ps1
# 原理: 监控项目目录文件的最后修改时间，如果超过指定时间没有任何文件变更，发出警告

param(
    [int]$TimeoutMinutes = 5,       # 超过多少分钟无文件变更视为卡死
    [int]$CheckIntervalSeconds = 30  # 检查间隔（秒）
)

$projectDir = "\\wsl.localhost\Ubuntu\home\yangyy\projects\fitness-muscle-building"
$logFile = "$env:TEMP\fitness-watchdog.log"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "HH:mm:ss"
    $line = "[$timestamp] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

Write-Log "=== Watchdog 启动 ==="
Write-Log "监控目录: $projectDir"
Write-Log "超时阈值: ${TimeoutMinutes} 分钟"
Write-Log "检查间隔: ${CheckIntervalSeconds} 秒"
Write-Log ""

$lastActivity = Get-Date
$alertSent = $false

while ($true) {
    Start-Sleep -Seconds $CheckIntervalSeconds

    # 获取目录下所有文件的最新修改时间
    try {
        $latestFile = Get-ChildItem -Path $projectDir -Recurse -File -ErrorAction Stop |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

        if ($latestFile) {
            $latestModTime = $latestFile.LastWriteTime
            $elapsed = (Get-Date) - $latestModTime

            if ($elapsed.TotalMinutes -lt $TimeoutMinutes) {
                # 有活动
                if ($alertSent) {
                    Write-Log "✅ 活动恢复！最新文件变更: $($latestFile.Name)"
                    $alertSent = $false
                }
                $lastActivity = $latestModTime
            }
            else {
                # 超时无活动
                if (-not $alertSent) {
                    $mins = [math]::Round($elapsed.TotalMinutes, 1)
                    Write-Log "⚠️  警告: 已 ${mins} 分钟无文件变更！"
                    Write-Log "    最后变更文件: $($latestFile.Name)"
                    Write-Log "    最后变更时间: $($latestModTime.ToString('HH:mm:ss'))"
                    Write-Log "    可能原因: 对话卡死 / Agent 无响应 / 等待用户输入"
                    Write-Log "    建议操作: 在 Antigravity 中发送任意消息触发恢复"

                    # Windows Toast 通知（如果可用）
                    try {
                        [void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
                        $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
                        $textNodes = $template.GetElementsByTagName("text")
                        $textNodes.Item(0).AppendChild($template.CreateTextNode("⚠️ 增肌追踪App开发")) | Out-Null
                        $textNodes.Item(1).AppendChild($template.CreateTextNode("对话已 ${mins} 分钟无响应！请检查 Antigravity")) | Out-Null
                        $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
                        $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("Fitness Watchdog")
                        $notifier.Show($toast)
                        Write-Log "    🔔 已发送Windows桌面通知"
                    }
                    catch {
                        Write-Log "    (桌面通知不可用，仅终端输出)"
                    }

                    $alertSent = $true
                }
            }
        }
    }
    catch {
        Write-Log "❌ 监控异常: $($_.Exception.Message)"
    }
}
