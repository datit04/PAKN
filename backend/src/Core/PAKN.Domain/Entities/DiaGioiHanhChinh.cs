namespace PAKN.Domain.Entities
{
    public class TinhThanh
    {
        public int Id { get; set; }
        public string MaTinh { get; set; } = string.Empty;
        public string TenTinh { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<PhuongXa> DanhSachPhuongXa { get; set; } = new List<PhuongXa>();
    }

    public class PhuongXa
    {
        public int Id { get; set; }
        public string MaPhuongXa { get; set; } = string.Empty;
        public string TenPhuongXa { get; set; } = string.Empty;
        public int TinhThanhId { get; set; }
        public bool IsActive { get; set; } = true;

        public TinhThanh? TinhThanh { get; set; }
    }
}
