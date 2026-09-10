using Microsoft.EntityFrameworkCore;
using PAKN.Application.Interfaces;
using PAKN.Domain.Entities;

namespace PAKN.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<TinhThanh> TinhThanh => Set<TinhThanh>();
        public DbSet<PhuongXa> PhuongXa => Set<PhuongXa>();
        public DbSet<DonVi> DonVi => Set<DonVi>();
        public DbSet<LinhVucPAKN> LinhVucPAKN => Set<LinhVucPAKN>();
        public DbSet<ChuDePAKN> ChuDePAKN => Set<ChuDePAKN>();
        public DbSet<NguoiGui> NguoiGui => Set<NguoiGui>();
        public DbSet<Domain.Entities.PAKN> PAKN => Set<Domain.Entities.PAKN>();
        public DbSet<PAKN_File> PAKN_File => Set<PAKN_File>();
        public DbSet<PAKN_PhanCong> PAKN_PhanCong => Set<PAKN_PhanCong>();
        public DbSet<PAKN_LichSuTrangThai> PAKN_LichSuTrangThai => Set<PAKN_LichSuTrangThai>();
        public DbSet<PAKN_TraLoi> PAKN_TraLoi => Set<PAKN_TraLoi>();
        public DbSet<PAKN_DanhGia> PAKN_DanhGia => Set<PAKN_DanhGia>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TinhThanh - PhuongXa (Mô hình 2 cấp)
            modelBuilder.Entity<TinhThanh>(entity =>
            {
                entity.ToTable("TinhThanh");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MaTinh).HasMaxLength(20).IsRequired();
                entity.Property(e => e.TenTinh).HasMaxLength(255).IsRequired();
                entity.HasIndex(e => e.MaTinh).IsUnique();
            });

            modelBuilder.Entity<PhuongXa>(entity =>
            {
                entity.ToTable("PhuongXa");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MaPhuongXa).HasMaxLength(20).IsRequired();
                entity.Property(e => e.TenPhuongXa).HasMaxLength(255).IsRequired();
                entity.HasIndex(e => e.MaPhuongXa).IsUnique();
                entity.HasIndex(e => e.TinhThanhId);
                entity.HasIndex(e => e.TenPhuongXa);

                entity.HasOne(e => e.TinhThanh)
                      .WithMany(t => t.DanhSachPhuongXa)
                      .HasForeignKey(e => e.TinhThanhId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // DonVi (Tự tham chiếu)
            modelBuilder.Entity<DonVi>(entity =>
            {
                entity.ToTable("DonVi");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MaDonVi).HasMaxLength(50).IsRequired();
                entity.Property(e => e.TenDonVi).HasMaxLength(500).IsRequired();
                entity.HasIndex(e => e.MaDonVi).IsUnique();

                entity.HasOne(e => e.DonViCha)
                      .WithMany(p => p.DonViCon)
                      .HasForeignKey(e => e.DonViChaId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // LinhVuc & ChuDe
            modelBuilder.Entity<LinhVucPAKN>(entity =>
            {
                entity.ToTable("LinhVucPAKN");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TenLinhVuc).HasMaxLength(255).IsRequired();
            });

            modelBuilder.Entity<ChuDePAKN>(entity =>
            {
                entity.ToTable("ChuDePAKN");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TenChuDe).HasMaxLength(500).IsRequired();

                entity.HasOne(e => e.LinhVuc)
                      .WithMany(l => l.DanhSachChuDe)
                      .HasForeignKey(e => e.LinhVucId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // NguoiGui
            modelBuilder.Entity<NguoiGui>(entity =>
            {
                entity.ToTable("NguoiGui");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.HoTen).HasMaxLength(255);
                entity.Property(e => e.TenDoanhNghiep).HasMaxLength(500);
                entity.Property(e => e.TenToChuc).HasMaxLength(500);
                entity.Property(e => e.SoDienThoai).HasMaxLength(20).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.DiaChiChiTiet).HasMaxLength(500);

                entity.HasOne(e => e.TinhThanh).WithMany().HasForeignKey(e => e.TinhThanhId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.PhuongXa).WithMany().HasForeignKey(e => e.PhuongXaId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.BoDiaPhuong).WithMany().HasForeignKey(e => e.BoDiaPhuongId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.DonViTrucThuoc).WithMany().HasForeignKey(e => e.DonViTrucThuocId).OnDelete(DeleteBehavior.Restrict);
            });

            // PAKN
            modelBuilder.Entity<Domain.Entities.PAKN>(entity =>
            {
                entity.ToTable("PAKN");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MaPAKN).HasMaxLength(50).IsRequired();
                entity.Property(e => e.MaBiMat).HasMaxLength(20).IsRequired();
                entity.Property(e => e.TieuDe).HasMaxLength(500).IsRequired();
                entity.Property(e => e.NoiDung).IsRequired();

                entity.HasIndex(e => e.MaPAKN).IsUnique();
                entity.HasIndex(e => e.TrangThai);
                entity.HasIndex(e => e.DonViTiepNhanId);

                entity.HasOne(e => e.NguoiGui).WithMany().HasForeignKey(e => e.NguoiGuiId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.DonViTiepNhan).WithMany().HasForeignKey(e => e.DonViTiepNhanId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ChuDe).WithMany().HasForeignKey(e => e.ChuDeId).OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.DanhGia)
                      .WithOne(d => d.PAKN)
                      .HasForeignKey<PAKN_DanhGia>(d => d.PAKNId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // PAKN_File
            modelBuilder.Entity<PAKN_File>(entity =>
            {
                entity.ToTable("PAKN_File");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TenFile).HasMaxLength(500).IsRequired();
                entity.Property(e => e.TenFileLuuTru).HasMaxLength(500).IsRequired();
                entity.Property(e => e.DuongDan).HasMaxLength(1000).IsRequired();

                entity.HasOne(e => e.PAKN)
                      .WithMany(p => p.Files)
                      .HasForeignKey(e => e.PAKNId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.TraLoi)
                      .WithMany(t => t.FilesDinhKem)
                      .HasForeignKey(e => e.TraLoiId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // PAKN_PhanCong
            modelBuilder.Entity<PAKN_PhanCong>(entity =>
            {
                entity.ToTable("PAKN_PhanCong");
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.PAKN).WithMany(p => p.DanhSachPhanCong).HasForeignKey(e => e.PAKNId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.DonVi).WithMany().HasForeignKey(e => e.DonViId).OnDelete(DeleteBehavior.Restrict);
            });

            // PAKN_LichSuTrangThai
            modelBuilder.Entity<PAKN_LichSuTrangThai>(entity =>
            {
                entity.ToTable("PAKN_LichSuTrangThai");
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.PAKN).WithMany(p => p.LichSuTrangThai).HasForeignKey(e => e.PAKNId).OnDelete(DeleteBehavior.Cascade);
            });

            // PAKN_TraLoi
            modelBuilder.Entity<PAKN_TraLoi>(entity =>
            {
                entity.ToTable("PAKN_TraLoi");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NoiDungTraLoi).IsRequired();
                entity.HasOne(e => e.PAKN).WithMany(p => p.DanhSachTraLoi).HasForeignKey(e => e.PAKNId).OnDelete(DeleteBehavior.Cascade);
            });

            // PAKN_DanhGia
            modelBuilder.Entity<PAKN_DanhGia>(entity =>
            {
                entity.ToTable("PAKN_DanhGia");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PAKNId).IsUnique();
            });
        }
    }
}
