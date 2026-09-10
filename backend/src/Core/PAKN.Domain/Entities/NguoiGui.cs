using PAKN.Domain.Enums;

namespace PAKN.Domain.Entities
{
    public class NguoiGui
    {
        public long Id { get; set; }
        public DoiTuongPAKN LoaiNguoiGui { get; set; }

        public string? HoTen { get; set; }
        public string? TenDoanhNghiep { get; set; }
        public string? TenToChuc { get; set; }
        public string SoDienThoai { get; set; } = string.Empty;
        public string? Email { get; set; }

        // Địa giới hành chính (2 cấp: Tỉnh -> Phường/Xã)
        public int? TinhThanhId { get; set; }
        public int? PhuongXaId { get; set; }
        public string? DiaChiChiTiet { get; set; }

        // Dành riêng cho Cơ quan nhà nước
        public long? BoDiaPhuongId { get; set; }
        public long? DonViTrucThuocId { get; set; }

        public string? UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public TinhThanh? TinhThanh { get; set; }
        public PhuongXa? PhuongXa { get; set; }
        public DonVi? BoDiaPhuong { get; set; }
        public DonVi? DonViTrucThuoc { get; set; }
    }
}
