using PAKN.Domain.Enums;

namespace PAKN.Domain.Entities
{
    public class PAKN
    {
        public long Id { get; set; }
        public string MaPAKN { get; set; } = string.Empty;
        public string MaBiMat { get; set; } = string.Empty;

        public DoiTuongPAKN DoiTuongPAKN { get; set; }
        public long NguoiGuiId { get; set; }

        public int? ChuDeId { get; set; }
        public int? LinhVucId { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;

        public long DonViTiepNhanId { get; set; }
        public TrangThaiPAKN TrangThai { get; set; } = TrangThaiPAKN.MoiTiepNhan;
        public MucDoUuTien MucDoUuTien { get; set; } = MucDoUuTien.BinhThuong;

        public DateTime? NgayTiepNhan { get; set; }
        public DateTime? HanXuLy { get; set; }
        public DateTime? NgayGiaHan { get; set; }
        public string? LyDoGiaHan { get; set; }
        public DateTime? NgayHoanThanh { get; set; }

        public bool IsAnDanh { get; set; } = false;
        public bool IsCongKhai { get; set; } = true;

        public DateTime NgayGui { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public NguoiGui? NguoiGui { get; set; }
        public DonVi? DonViTiepNhan { get; set; }
        public ChuDePAKN? ChuDe { get; set; }
        public LinhVucPAKN? LinhVuc { get; set; }

        public ICollection<PAKN_File> Files { get; set; } = new List<PAKN_File>();
        public ICollection<PAKN_PhanCong> DanhSachPhanCong { get; set; } = new List<PAKN_PhanCong>();
        public ICollection<PAKN_LichSuTrangThai> LichSuTrangThai { get; set; } = new List<PAKN_LichSuTrangThai>();
        public ICollection<PAKN_TraLoi> DanhSachTraLoi { get; set; } = new List<PAKN_TraLoi>();
        public PAKN_DanhGia? DanhGia { get; set; }
    }

    public class PAKN_File
    {
        public long Id { get; set; }
        public long PAKNId { get; set; }
        public long? TraLoiId { get; set; }
        public LoaiDinhKem LoaiDinhKem { get; set; } = LoaiDinhKem.NguoiDanGui;

        public string TenFile { get; set; } = string.Empty;
        public string TenFileLuuTru { get; set; } = string.Empty;
        public string DuongDan { get; set; } = string.Empty;
        public long? DungLuong { get; set; }
        public string? LoaiFile { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public PAKN? PAKN { get; set; }
        public PAKN_TraLoi? TraLoi { get; set; }
    }

    public class PAKN_PhanCong
    {
        public long Id { get; set; }
        public long PAKNId { get; set; }
        public long DonViId { get; set; }
        public string? NguoiXuLyId { get; set; }

        public LoaiPhanCong LoaiPhanCong { get; set; } = LoaiPhanCong.GiaoChuyenVienXuLy;
        public string? NoiDungGiaoViec { get; set; }
        public DateTime? HanXuLy { get; set; }

        public string? NguoiGiaoId { get; set; }
        public DateTime NgayPhanCong { get; set; } = DateTime.UtcNow;
        public int TrangThai { get; set; } = 1;

        public PAKN? PAKN { get; set; }
        public DonVi? DonVi { get; set; }
    }

    public class PAKN_LichSuTrangThai
    {
        public long Id { get; set; }
        public long PAKNId { get; set; }
        public TrangThaiPAKN? TrangThaiCu { get; set; }
        public TrangThaiPAKN TrangThaiMoi { get; set; }
        public string? NguoiThucHienId { get; set; }
        public string? GhiChu { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public PAKN? PAKN { get; set; }
    }

    public class PAKN_TraLoi
    {
        public long Id { get; set; }
        public long PAKNId { get; set; }

        public string? SoCongVanTraLoi { get; set; }
        public string NoiDungTraLoi { get; set; } = string.Empty;

        public string? NguoiSoanId { get; set; }
        public string? NguoiDuyetId { get; set; }
        public DateTime? NgayDuyet { get; set; }

        public bool IsPublished { get; set; } = false;
        public int LanTraLoi { get; set; } = 1;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public PAKN? PAKN { get; set; }
        public ICollection<PAKN_File> FilesDinhKem { get; set; } = new List<PAKN_File>();
    }

    public class PAKN_DanhGia
    {
        public long Id { get; set; }
        public long PAKNId { get; set; }

        public MucDoHaiLong MucDoHaiLong { get; set; }
        public int? TieuChiThoiGian { get; set; }
        public int? TieuChiThaiDo { get; set; }
        public string? NoiDungGopY { get; set; }
        public DateTime NgayDanhGia { get; set; } = DateTime.UtcNow;

        public PAKN? PAKN { get; set; }
    }
}
