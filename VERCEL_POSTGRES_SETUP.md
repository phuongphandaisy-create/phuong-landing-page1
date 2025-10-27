# Vercel Postgres Setup Guide

Hướng dẫn thiết lập Vercel Postgres cho landing page project.

## 🚀 Bước 1: Chuẩn bị project

Project đã được cấu hình sẵn để hỗ trợ Vercel Postgres:

- ✅ Prisma schema đã được cập nhật cho PostgreSQL
- ✅ Build scripts đã được tối ưu cho Vercel
- ✅ Environment variables đã được cấu hình

## 🗄️ Bước 2: Tạo Vercel Postgres Database

### Trên Vercel Dashboard:

1. Đi tới project của bạn trên [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `phuong-landing-page1`
3. Vào tab **Storage**
4. Click **Create Database**
5. Chọn **Postgres**
6. Đặt tên database (ví dụ: `phuong-landing-db`)
7. Chọn region gần nhất (Singapore cho VN)
8. Click **Create**

### Vercel sẽ tự động:
- Tạo database instance
- Set environment variable `DATABASE_URL`
- Kết nối với project của bạn

## 🔧 Bước 3: Cấu hình Environment Variables

Trên Vercel Dashboard, vào **Settings** > **Environment Variables** và thêm:

```
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**Lưu ý:** `DATABASE_URL` sẽ được Vercel tự động set.

## 🚀 Bước 4: Deploy

1. Push code lên GitHub:
```bash
git add .
git commit -m "Add Vercel Postgres support"
git push origin main
```

2. Vercel sẽ tự động deploy và:
   - Generate Prisma client
   - Push database schema
   - Seed initial data
   - Build Next.js app

## 🧪 Bước 5: Kiểm tra

Sau khi deploy thành công:

1. Truy cập website của bạn
2. Test các chức năng:
   - Đăng ký/đăng nhập
   - Tạo blog post
   - Gửi contact form
3. Check Vercel Postgres dashboard để xem data

## 🔄 Development vs Production

### Local Development (Recommended)
- Tiếp tục dùng SQLite cho development
- File: `.env.local`
```
DATABASE_URL="file:./dev.db"
```

### Production
- Dùng Vercel Postgres
- Environment variables được Vercel tự động set

## 📊 Database Management

### Xem data trên Vercel:
1. Vào Storage tab
2. Click vào database
3. Dùng Query tab để chạy SQL

### Local access to production DB:
```bash
# Get connection string from Vercel dashboard
npx prisma studio --url="your-production-database-url"
```

## 🛠️ Troubleshooting

### Build fails:
- Check environment variables
- Verify DATABASE_URL format
- Check Prisma schema syntax

### Database connection issues:
- Verify Vercel Postgres is running
- Check region settings
- Verify SSL requirements

### Migration issues:
```bash
# Reset database (careful - deletes data!)
npx prisma db push --force-reset

# Re-seed data
npm run db:seed
```

## 💡 Tips

1. **Backup**: Vercel Postgres có automatic backups
2. **Monitoring**: Check Vercel Analytics và Postgres metrics
3. **Scaling**: Postgres sẽ auto-scale theo usage
4. **Cost**: Free tier có limits, monitor usage

## 🎯 Next Steps

Sau khi setup xong:

1. Test thoroughly trên production
2. Set up monitoring/alerts
3. Configure backup strategy
4. Optimize database queries nếu cần

---

**Lưu ý quan trọng:** Vercel Postgres free tier có giới hạn:
- 60 hours compute time/month
- 256 MB storage
- 1 database

Nếu cần nhiều hơn, cần upgrade plan.