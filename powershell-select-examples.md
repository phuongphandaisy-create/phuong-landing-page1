# PowerShell Select-Object Examples

## 🎯 Cú pháp cơ bản

```powershell
Get-Command | Select-Object Name, CommandType
Get-Process | Select-Object Name, CPU, WorkingSet
Get-Service | Select-Object Name, Status, StartType
```

## 💻 Thông tin hệ thống

### **1. Thông tin Windows**
```powershell
# Thông tin cơ bản
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory

# Thông tin chi tiết hơn
Get-ComputerInfo | Select-Object @{
    Name = "OS"; Expression = {$_.WindowsProductName}
}, @{
    Name = "Version"; Expression = {$_.WindowsVersion}
}, @{
    Name = "RAM_GB"; Expression = {[math]::Round($_.TotalPhysicalMemory/1GB, 2)}
}
```

### **2. Thông tin CPU**
```powershell
Get-WmiObject -Class Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed
```

### **3. Thông tin Memory**
```powershell
Get-WmiObject -Class Win32_OperatingSystem | Select-Object @{
    Name = "Total_RAM_GB"; Expression = {[math]::Round($_.TotalVisibleMemorySize/1MB, 2)}
}, @{
    Name = "Free_RAM_GB"; Expression = {[math]::Round($_.FreePhysicalMemory/1MB, 2)}
}, @{
    Name = "Used_RAM_GB"; Expression = {[math]::Round(($_.TotalVisibleMemorySize - $_.FreePhysicalMemory)/1MB, 2)}
}
```

### **4. Thông tin Disk**
```powershell
Get-WmiObject -Class Win32_LogicalDisk | Select-Object DeviceID, @{
    Name = "Size_GB"; Expression = {[math]::Round($_.Size/1GB, 2)}
}, @{
    Name = "FreeSpace_GB"; Expression = {[math]::Round($_.FreeSpace/1GB, 2)}
}, @{
    Name = "Used_Percent"; Expression = {[math]::Round((($_.Size - $_.FreeSpace)/$_.Size)*100, 2)}
}
```

## 🔧 Node.js và Development

### **1. Kiểm tra Node.js processes**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select-Object Name, Id, CPU, WorkingSet
```

### **2. Kiểm tra ports đang sử dụng**
```powershell
netstat -ano | Select-String ":3000|:8080|:5000" | ForEach-Object {
    $parts = $_.Line -split '\s+'
    [PSCustomObject]@{
        Protocol = $parts[0]
        LocalAddress = $parts[1]
        State = $parts[3]
        PID = $parts[4]
    }
}
```

### **3. Environment Variables liên quan Node.js**
```powershell
Get-ChildItem Env: | Where-Object {$_.Name -like "*NODE*" -or $_.Name -like "*NPM*"} | Select-Object Name, Value
```

## 📁 File System

### **1. Thông tin thư mục dự án**
```powershell
Get-ChildItem "E:\Landing page" | Select-Object Name, Length, LastWriteTime, @{
    Name = "Type"; Expression = {if($_.PSIsContainer){"Folder"}else{"File"}}
}
```

### **2. Tìm files theo extension**
```powershell
Get-ChildItem "E:\Landing page" -Recurse -Include "*.js", "*.ts", "*.tsx" | Select-Object Name, Directory, Length, LastWriteTime
```

### **3. Top 10 files lớn nhất**
```powershell
Get-ChildItem "E:\Landing page" -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 Name, @{
    Name = "Size_MB"; Expression = {[math]::Round($_.Length/1MB, 2)}
}, Directory
```

## 🌐 Network Information

### **1. Network adapters**
```powershell
Get-NetAdapter | Select-Object Name, InterfaceDescription, LinkSpeed, Status
```

### **2. IP Configuration**
```powershell
Get-NetIPAddress | Where-Object {$_.AddressFamily -eq "IPv4"} | Select-Object InterfaceAlias, IPAddress, PrefixLength
```

## 🎨 Custom Properties với Calculated Fields

### **Ví dụ phức tạp:**
```powershell
Get-Process | Select-Object Name, 
    @{Name = "CPU_Percent"; Expression = {$_.CPU}},
    @{Name = "Memory_MB"; Expression = {[math]::Round($_.WorkingSet/1MB, 2)}},
    @{Name = "Runtime"; Expression = {(Get-Date) - $_.StartTime}},
    @{Name = "Priority"; Expression = {$_.PriorityClass}}
```

## 🔍 Filtering và Sorting kết hợp

### **1. Top processes theo memory**
```powershell
Get-Process | Sort-Object WorkingSet -Descending | Select-Object -First 5 Name, @{
    Name = "Memory_MB"; Expression = {[math]::Round($_.WorkingSet/1MB, 2)}
}
```

### **2. Services đang chạy**
```powershell
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, DisplayName, StartType | Sort-Object Name
```

## 📊 Export Results

### **1. Export to CSV**
```powershell
Get-Process | Select-Object Name, CPU, WorkingSet | Export-Csv -Path "processes.csv" -NoTypeInformation
```

### **2. Export to JSON**
```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory | ConvertTo-Json | Out-File "system-info.json"
```

### **3. Format as Table**
```powershell
Get-Service | Select-Object Name, Status, StartType | Format-Table -AutoSize
```

## 🚀 Practical Examples cho Development

### **1. Check development environment**
```powershell
$devInfo = [PSCustomObject]@{
    NodeJS = if(Get-Command node -ErrorAction SilentlyContinue) {node --version} else {"Not installed"}
    NPM = if(Get-Command npm -ErrorAction SilentlyContinue) {npm --version} else {"Not installed"}
    Git = if(Get-Command git -ErrorAction SilentlyContinue) {git --version} else {"Not installed"}
    VSCode = if(Get-Command code -ErrorAction SilentlyContinue) {"Installed"} else {"Not installed"}
}
$devInfo | Select-Object NodeJS, NPM, Git, VSCode
```

### **2. Project structure analysis**
```powershell
Get-ChildItem "E:\Landing page" -Recurse | Group-Object Extension | Select-Object Name, Count | Sort-Object Count -Descending
```

### **3. Package.json analysis**
```powershell
if(Test-Path "package.json") {
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $pkg.dependencies.PSObject.Properties | Select-Object Name, Value
}
```

## 💡 Pro Tips

### **1. Alias cho Select-Object**
```powershell
# Có thể dùng 'select' thay vì 'Select-Object'
Get-Process | select Name, CPU
```

### **2. Multiple selections**
```powershell
Get-Process | select Name, CPU, @{n="Memory_MB";e={$_.WS/1MB}}
```

### **3. Conditional selection**
```powershell
Get-Service | select Name, Status, @{
    Name = "Health"; 
    Expression = {if($_.Status -eq "Running"){"✅ Good"}else{"❌ Issue"}}
}
```

Bạn có thể thử các lệnh này để lấy thông tin hệ thống một cách chi tiết và có tổ chức!