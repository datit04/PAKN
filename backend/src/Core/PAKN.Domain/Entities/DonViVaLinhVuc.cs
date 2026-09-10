namespace PAKN.Domain.Entities
{
    public class DonVi
    {
        public long Id { get; set; }
        public string MaDonVi { get; set; } = string.Empty;
        public string TenDonVi { get; set; } = string.Empty;
        public long? DonViChaId { get; set; }
        public int LoaiDonVi { get; set; } = 1; // 1: Bộ/Cơ quan/Địa phương, 2: Hội đồng tư vấn TTHC
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DonVi? DonViCha { get; set; }
        public ICollection<DonVi> DonViCon { get; set; } = new List<DonVi>();
    }

    public class LinhVucPAKN
    {
        public int Id { get; set; }
        public string TenLinhVuc { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<ChuDePAKN> DanhSachChuDe { get; set; } = new List<ChuDePAKN>();
    }

    public class ChuDePAKN
    {
        public int Id { get; set; }
        public int LinhVucId { get; set; }
        public string TenChuDe { get; set; } = string.Empty;
        public int ThoiGianXuLyMacDinhNgay { get; set; } = 15;
        public bool IsActive { get; set; } = true;

        public LinhVucPAKN? LinhVuc { get; set; }
    }
}
