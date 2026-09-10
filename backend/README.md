# HƯỚNG DẪN KHỞI CHẠY BACKEND (.NET 8 CLEAN ARCHITECTURE)

Toàn bộ mã nguồn Backend đã được thiết lập tại:
📂 `D:\pakn-system\backend`

---

## 1. Cấu hình chuỗi kết nối SQL Server
Mở file: `src\Presentation\PAKN.WebAPI\appsettings.json`
Chỉnh lại dòng `DefaultConnection` phù hợp với máy của bạn:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=PAKN_System_Db;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```
* Nếu dùng SQL Express: Đổi thành `Server=.\\SQLEXPRESS;...`
* Nếu dùng tài khoản sa: `Server=localhost;Database=PAKN_System_Db;User Id=sa;Password=MẬT_KHẨU;TrustServerCertificate=True`

---

## 2. Khởi chạy Backend bằng PowerShell
Mở PowerShell và gõ:

```powershell
cd D:\pakn-system\backend
dotnet build
dotnet run --project src/Presentation/PAKN.WebAPI
```

Backend sẽ tự động:
1. Tạo Database `PAKN_System_Db` trên SQL Server nếu chưa có.
2. Tạo đủ 12 bảng chuẩn mô hình chính quyền 2 cấp.
3. Nạp dữ liệu mẫu (Hà Nội, TP.HCM, Đà Nẵng, các xã/phường 2 cấp, các Sở ban ngành, lĩnh vực môi trường, giao thông...).
4. Mở cổng `http://localhost:5000`.

---

## 3. Kiểm tra Swagger UI
Mở trình duyệt truy cập:
👉 **`http://localhost:5000/swagger`**
