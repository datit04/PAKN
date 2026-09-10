using PAKN.Domain.Enums;

namespace PAKN.Application.DTOs
{
    public class PhanCongRequest
    {
        public long DonViId { get; set; }
        public string? NguoiXuLyId { get; set; }
        public LoaiPhanCong LoaiPhanCong { get; set; } = LoaiPhanCong.GiaoChuyenVienXuLy;
        public string? NoiDungGiaoViec { get; set; }
        public DateTime? HanXuLy { get; set; }
    }

    public class SoanTraLoiRequest
    {
        public string? SoCongVanTraLoi { get; set; }
        public string NoiDungTraLoi { get; set; } = string.Empty;
        public List<FileAttachmentDto> FilesDinhKem { get; set; } = new();
    }

    public class DuyetTraLoiRequest
    {
        public long TraLoiId { get; set; }
        public bool IsApprove { get; set; } = true;
        public string? GhiChu { get; set; }
    }

    public class GiaHanRequest
    {
        public DateTime NgayGiaHanMoi { get; set; }
        public string LyDo { get; set; } = string.Empty;
    }
}
