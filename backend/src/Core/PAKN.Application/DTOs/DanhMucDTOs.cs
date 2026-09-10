using PAKN.Domain.Enums;

namespace PAKN.Application.DTOs
{
    public class TinhThanhDto
    {
        public int Id { get; set; }
        public string MaTinh { get; set; } = string.Empty;
        public string TenTinh { get; set; } = string.Empty;
    }

    public class PhuongXaDto
    {
        public int Id { get; set; }
        public string MaPhuongXa { get; set; } = string.Empty;
        public string TenPhuongXa { get; set; } = string.Empty;
        public int TinhThanhId { get; set; }
    }

    public class DonViDto
    {
        public long Id { get; set; }
        public string MaDonVi { get; set; } = string.Empty;
        public string TenDonVi { get; set; } = string.Empty;
        public long? DonViChaId { get; set; }
        public int LoaiDonVi { get; set; }
    }

    public class ChuDeDto
    {
        public int Id { get; set; }
        public string TenChuDe { get; set; } = string.Empty;
        public int ThoiGianXuLyMacDinhNgay { get; set; }
    }

    public class LinhVucDto
    {
        public int Id { get; set; }
        public string TenLinhVuc { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public List<ChuDeDto> DanhSachChuDe { get; set; } = new();
    }

    // CRUD Requests
    public class CreateDonViRequest
    {
        public string MaDonVi { get; set; } = string.Empty;
        public string TenDonVi { get; set; } = string.Empty;
        public long? DonViChaId { get; set; }
        public int LoaiDonVi { get; set; } = 1;
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
    }

    public class UpdateDonViRequest : CreateDonViRequest
    {
        public bool IsActive { get; set; } = true;
    }

    public class CreateLinhVucRequest
    {
        public string TenLinhVuc { get; set; } = string.Empty;
        public string? MoTa { get; set; }
    }

    public class UpdateLinhVucRequest : CreateLinhVucRequest
    {
        public bool IsActive { get; set; } = true;
    }

    public class CreateChuDeRequest
    {
        public int LinhVucId { get; set; }
        public string TenChuDe { get; set; } = string.Empty;
        public int ThoiGianXuLyMacDinhNgay { get; set; } = 15;
    }

    public class UpdateChuDeRequest : CreateChuDeRequest
    {
        public bool IsActive { get; set; } = true;
    }

    // CRUD Tỉnh/Thành
    public class CreateTinhThanhRequest
    {
        public string MaTinh { get; set; } = string.Empty;
        public string TenTinh { get; set; } = string.Empty;
    }

    public class UpdateTinhThanhRequest : CreateTinhThanhRequest
    {
        public bool IsActive { get; set; } = true;
    }

    // CRUD Phường/Xã (Mô hình 2 cấp)
    public class CreatePhuongXaRequest
    {
        public int TinhThanhId { get; set; }
        public string MaPhuongXa { get; set; } = string.Empty;
        public string TenPhuongXa { get; set; } = string.Empty;
    }

    public class UpdatePhuongXaRequest : CreatePhuongXaRequest
    {
        public bool IsActive { get; set; } = true;
    }
}
