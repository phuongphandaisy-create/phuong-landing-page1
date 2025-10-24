# Sau khi cài đặt Node.js xong

## Bước 1: Kiểm tra cài đặt
Mở PowerShell mới và chạy:
```powershell
node --version
npm --version
```

## Bước 2: Cài đặt dependencies cho dự án
```powershell
cd "E:\Landing page"
npm install
```

## Bước 3: Cài đặt testing dependencies
```powershell
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
```

## Bước 4: Chạy tests
```powershell
# Chạy tất cả tests
npm run test

# Chạy tests với coverage
npm run test:coverage

# Chạy tests trong watch mode
npm run test:watch
```

## Bước 5: Chạy development server
```powershell
npm run dev
```

## Bước 6: Setup database (nếu cần)
```powershell
npm run db:setup
npm run db:migrate
npm run db:seed
```

## Nếu gặp lỗi permission:
```powershell
# Chạy PowerShell với quyền Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Kiểm tra PATH environment:
```powershell
$env:PATH -split ';' | Where-Object { $_ -like '*node*' }
```