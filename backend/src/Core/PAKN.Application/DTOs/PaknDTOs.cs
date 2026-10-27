using PAKN.Domain.Enums;

namespace PAKN.Application.DTOs
{
    public class NguoiGuiDto
    {
        public string? HoTen { get; set; }
        public string? TenDoanhNghiep { get; set; }
        public string? TenToChuc { get; set; }
        public string SoDienThoai { get; set; } = string.Empty;
        public string? Email { get; set; }

        public int? TinhThanhId { get; set; }
        public int? PhuongXaId { get; set; }
        public string? DiaChiChiTiet { get; set; }

        public long? BoDiaPhuongId { get; set; }
        public long? DonViTrucThuocId { get; set; }
    }

    public class FileAttachmentDto
    {
        public string TenFile { get; set; } = string.Empty;
        public string DuongDan { get; set; } = string.Empty;
        public long DungLuong { get; set; }
        public string LoaiFile { get; set; } = string.Empty;
    }

    public class CreatePaknRequest
    {
        public DoiTuongPAKN DoiTuongPAKN { get; set; }
        public NguoiGuiDto NguoiGui { get; set; } = new();

        public int? ChuDeId { get; set; }
        public int? LinhVucId { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public long DonViTiepNhanId { get; set; }

        public bool IsAnDanh { get; set; } = false;
        public string CaptchaId { get; set; } = string.Empty;
        public string CaptchaCode { get; set; } = string.Empty;

        public List<FileAttachmentDto> Files { get; set; } = new();
    }

    public class CreatePaknResponse
    {
        public string MaPAKN { get; set; } = string.Empty;
        public string MaBiMat { get; set; } = string.Empty;
        public DateTime NgayGui { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class TraCuuChiTietRequest
    {
        public string MaPAKN { get; set; } = string.Empty;
        public string NguoiGui { get; set; } = string.Empty;
    }

    public class LichSuTrangThaiDto
    {
        public TrangThaiPAKN? TrangThaiCu { get; set; }
        public TrangThaiPAKN TrangThaiMoi { get; set; }
        public string? GhiChu { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class TraLoiDto
    {
        public string? SoCongVanTraLoi { get; set; }
        public string NoiDungTraLoi { get; set; } = string.Empty;
        public DateTime? NgayDuyet { get; set; }
        public List<FileAttachmentDto> FilesDinhKem { get; set; } = new();
    }

    public class DanhGiaDto
    {
        public MucDoHaiLong MucDoHaiLong { get; set; }
        public string? NoiDungGopY { get; set; }
        public DateTime NgayDanhGia { get; set; }
    }

    public class PaknChiTietResponse
    {
        public long Id { get; set; }
        public string MaPAKN { get; set; } = string.Empty;
        public DoiTuongPAKN DoiTuongPAKN { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public TrangThaiPAKN TrangThai { get; set; }
        public DateTime NgayGui { get; set; }
        public DateTime? HanXuLy { get; set; }

        public string TenDonViTiepNhan { get; set; } = string.Empty;
        public string? TenChuDe { get; set; }
        public string? TenLinhVuc { get; set; }

        public NguoiGuiDto NguoiGui { get; set; } = new();
        public List<FileAttachmentDto> Files { get; set; } = new();
        public List<LichSuTrangThaiDto> LichSu { get; set; } = new();
        public List<TraLoiDto> TraLoi { get; set; } = new();
        public DanhGiaDto? DanhGia { get; set; }
    }

    public class PaknCongKhaiDto
    {
        public string MaPAKN { get; set; } = string.Empty;
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string TenDonViTiepNhan { get; set; } = string.Empty;
        public string NguoiGuiChe { get; set; } = string.Empty; // VD: Nguyễn V***
        public TrangThaiPAKN TrangThai { get; set; }
        public DateTime NgayGui { get; set; }
        public string? CauTraLoiMoiNhat { get; set; }
        public DateTime? NgayTraLoi { get; set; }
    }

    public class ThongKeTrangThaiDto
    {
        public TrangThaiPAKN TrangThai { get; set; }
        public int SoLuong { get; set; }
    }

    public class ThongKeTopDonViDto
    {
        public long DonViId { get; set; }
        public string TenDonVi { get; set; } = string.Empty;
        public int SoLuong { get; set; }
    }

    public class ThongKeAdminDto
    {
        public int TongSo { get; set; }
        public List<ThongKeTrangThaiDto> TheoTrangThai { get; set; } = new();
        public int QuaHan { get; set; }
        public List<ThongKeTopDonViDto> TopDonViDangXuLy { get; set; } = new();
    }

    public class DanhGiaRequest
    {
        public string MaPAKN { get; set; } = string.Empty;
        public string MaBiMat { get; set; } = string.Empty;
        public MucDoHaiLong MucDoHaiLong { get; set; }
        public int? TieuChiThoiGian { get; set; }
        public int? TieuChiThaiDo { get; set; }
        public string? NoiDungGopY { get; set; }
    }
}
