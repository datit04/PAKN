using Microsoft.EntityFrameworkCore;
using PAKN.Domain.Entities;

namespace PAKN.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<TinhThanh> TinhThanh { get; }
        DbSet<PhuongXa> PhuongXa { get; }
        DbSet<DonVi> DonVi { get; }
        DbSet<LinhVucPAKN> LinhVucPAKN { get; }
        DbSet<ChuDePAKN> ChuDePAKN { get; }
        DbSet<NguoiGui> NguoiGui { get; }
        DbSet<PAKN.Domain.Entities.PAKN> PAKN { get; }
        DbSet<PAKN_File> PAKN_File { get; }
        DbSet<PAKN_PhanCong> PAKN_PhanCong { get; }
        DbSet<PAKN_LichSuTrangThai> PAKN_LichSuTrangThai { get; }
        DbSet<PAKN_TraLoi> PAKN_TraLoi { get; }
        DbSet<PAKN_DanhGia> PAKN_DanhGia { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }

    public interface ICaptchaService
    {
        (string CaptchaId, string Base64Image) GenerateCaptcha();
        bool ValidateCaptcha(string captchaId, string code);
    }

    public interface IStorageService
    {
        Task<(string FileKey, string OriginalName, long Size, string ContentType)> SaveFileAsync(Stream fileStream, string fileName, string contentType);
        Task<Stream?> GetFileAsync(string fileKey);
    }
}
