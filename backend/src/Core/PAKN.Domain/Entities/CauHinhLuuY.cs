namespace PAKN.Domain.Entities
{
    public class CauHinhLuuY
    {
        public int Id { get; set; }
        public string NoiDung { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int ThuTu { get; set; } = 1;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public CauHinhLuuY? Parent { get; set; }
        public ICollection<CauHinhLuuY> Children { get; set; } = new List<CauHinhLuuY>();
    }
}

