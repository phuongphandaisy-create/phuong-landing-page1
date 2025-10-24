# Hướng dẫn cài đặt Node.js trên Windows

## Phương pháp 1: Tải từ trang chính thức (Khuyến nghị)

1. **Truy cập trang chính thức:**
   - Mở trình duyệt và truy cập: https://nodejs.org/
   
2. **Tải phiên bản LTS:**
   - Click vào nút "LTS" (Long Term Support) - phiên bản ổn định nhất
   - Chọn "Windows Installer (.msi)" cho Windows x64
   
3. **Cài đặt:**
   - Chạy file .msi đã tải
   - Làm theo hướng dẫn cài đặt (Next > Next > Install)
   - Đảm bảo tích chọn "Add to PATH" trong quá trình cài đặt

4. **Kiểm tra cài đặt:**
   ```powershell
   node --version
   npm --version
   ```

## Phương pháp 2: Sử dụng Chocolatey (Package Manager)

1. **Cài đặt Chocolatey trước:**
   - Mở PowerShell với quyền Administrator
   - Chạy lệnh:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. **Cài đặt Node.js qua Chocolatey:**
   ```powershell
   choco install nodejs
   ```

## Phương pháp 3: Sử dụng Winget (Windows Package Manager)

```powershell
winget install OpenJS.NodeJS
```

## Phương pháp 4: Sử dụng Scoop

1. **Cài đặt Scoop:**
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. **Cài đặt Node.js:**
   ```powershell
   scoop install nodejs
   ```

## Sau khi cài đặt xong:

1. **Khởi động lại PowerShell/Command Prompt**
2. **Kiểm tra phiên bản:**
   ```powershell
   node --version
   npm --version
   ```
3. **Cài đặt dependencies cho dự án:**
   ```powershell
   npm install
   ```
4. **Chạy tests:**
   ```powershell
   npm run test
   ```

## Lưu ý quan trọng:

- **Phiên bản khuyến nghị:** Node.js 18.x hoặc 20.x LTS
- **Đảm bảo PATH được cập nhật** sau khi cài đặt
- **Khởi động lại terminal** sau khi cài đặt
- **Chạy với quyền Administrator** nếu gặp lỗi permission

## Troubleshooting:

### Nếu vẫn không nhận diện được node/npm:
1. Kiểm tra PATH environment variable
2. Khởi động lại máy tính
3. Cài đặt lại Node.js với quyền Administrator

### Nếu gặp lỗi permission khi chạy npm:
```powershell
npm config set registry https://registry.npmjs.org/
npm cache clean --force
```