namespace PAKN.Domain.Entities
{
    public class CauHinhHeThong
    {
        public string MaCauHinh { get; set; } = string.Empty; // Primary key: ví dụ "LUU_Y_SIDEBAR"
        public string? TenCauHinh { get; set; }
        public string GiaTri { get; set; } = string.Empty;     // Nội dung HTML Rich Text
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

