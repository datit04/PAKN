using Microsoft.EntityFrameworkCore;
using PAKN.Application.DTOs;
using PAKN.Application.Interfaces;

namespace PAKN.Application.Services
{
    public interface IDanhMucService
    {
        Task<List<TinhThanhDto>> GetTinhThanhAsync();
        Task<List<PhuongXaDto>> GetPhuongXaAsync(int tinhThanhId, string? keyword = null);
        Task<List<DonViDto>> GetDonViTiepNhanAsync(int? loaiDonVi = null);
        Task<List<LinhVucDto>> GetLinhVucVaChuDeAsync();

        // CRUD Đơn vị
        Task<DonViDto> CreateDonViAsync(CreateDonViRequest request);
        Task<bool> UpdateDonViAsync(long id, UpdateDonViRequest request);
        Task<bool> DeleteDonViAsync(long id);

        // CRUD Lĩnh vực
        Task<LinhVucDto> CreateLinhVucAsync(CreateLinhVucRequest request);
        Task<bool> UpdateLinhVucAsync(int id, UpdateLinhVucRequest request);
        Task<bool> DeleteLinhVucAsync(int id);

        // CRUD Chủ đề
        Task<ChuDeDto> CreateChuDeAsync(CreateChuDeRequest request);
        Task<bool> UpdateChuDeAsync(int id, UpdateChuDeRequest request);
        Task<bool> DeleteChuDeAsync(int id);

        // CRUD Tỉnh/Thành
        Task<TinhThanhDto> CreateTinhThanhAsync(CreateTinhThanhRequest request);
        Task<bool> UpdateTinhThanhAsync(int id, UpdateTinhThanhRequest request);
        Task<bool> DeleteTinhThanhAsync(int id);

        // CRUD Phường/Xã (Mô hình 2 cấp)
        Task<PhuongXaDto> CreatePhuongXaAsync(CreatePhuongXaRequest request);
        Task<bool> UpdatePhuongXaAsync(int id, UpdatePhuongXaRequest request);
        Task<bool> DeletePhuongXaAsync(int id);
    }

    public class DanhMucService : IDanhMucService
    {
        private readonly IApplicationDbContext _context;

        public DanhMucService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TinhThanhDto>> GetTinhThanhAsync()
        {
            return await _context.TinhThanh
                .Where(x => x.IsActive)
                .OrderBy(x => x.TenTinh)
                .Select(x => new TinhThanhDto
                {
                    Id = x.Id,
                    MaTinh = x.MaTinh,
                    TenTinh = x.TenTinh
                }).ToListAsync();
        }

        public async Task<List<PhuongXaDto>> GetPhuongXaAsync(int tinhThanhId, string? keyword = null)
        {
            var query = _context.PhuongXa
                .Where(x => x.TinhThanhId == tinhThanhId && x.IsActive);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.TenPhuongXa.Contains(keyword) || x.MaPhuongXa.Contains(keyword));
            }

            return await query
                .OrderBy(x => x.TenPhuongXa)
                .Take(50)
                .Select(x => new PhuongXaDto
                {
                    Id = x.Id,
                    MaPhuongXa = x.MaPhuongXa,
                    TenPhuongXa = x.TenPhuongXa,
                    TinhThanhId = x.TinhThanhId
                }).ToListAsync();
        }

        public async Task<List<DonViDto>> GetDonViTiepNhanAsync(int? loaiDonVi = null)
        {
            var query = _context.DonVi.AsQueryable();
            if (loaiDonVi.HasValue)
            {
                query = query.Where(x => x.LoaiDonVi == loaiDonVi.Value);
            }

            return await query
                .OrderBy(x => x.TenDonVi)
                .Select(x => new DonViDto
                {
                    Id = x.Id,
                    MaDonVi = x.MaDonVi,
                    TenDonVi = x.TenDonVi,
                    DonViChaId = x.DonViChaId,
                    LoaiDonVi = x.LoaiDonVi
                }).ToListAsync();
        }

        public async Task<List<LinhVucDto>> GetLinhVucVaChuDeAsync()
        {
            return await _context.LinhVucPAKN
                .Include(x => x.DanhSachChuDe)
                .Select(x => new LinhVucDto
                {
                    Id = x.Id,
                    TenLinhVuc = x.TenLinhVuc,
                    MoTa = x.MoTa,
                    DanhSachChuDe = x.DanhSachChuDe.Select(c => new ChuDeDto
                    {
                        Id = c.Id,
                        TenChuDe = c.TenChuDe,
                        ThoiGianXuLyMacDinhNgay = c.ThoiGianXuLyMacDinhNgay
                    }).ToList()
                }).ToListAsync();
        }

        // ================= CRUD ĐƠN VỊ =================
        public async Task<DonViDto> CreateDonViAsync(CreateDonViRequest request)
        {
            var donVi = new Domain.Entities.DonVi
            {
                MaDonVi = request.MaDonVi.Trim().ToUpperInvariant(),
                TenDonVi = request.TenDonVi.Trim(),
                DonViChaId = request.DonViChaId,
                LoaiDonVi = request.LoaiDonVi,
                Email = request.Email,
                SoDienThoai = request.SoDienThoai,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.DonVi.Add(donVi);
            await _context.SaveChangesAsync();

            return new DonViDto
            {
                Id = donVi.Id,
                MaDonVi = donVi.MaDonVi,
                TenDonVi = donVi.TenDonVi,
                DonViChaId = donVi.DonViChaId,
                LoaiDonVi = donVi.LoaiDonVi
            };
        }

        public async Task<bool> UpdateDonViAsync(long id, UpdateDonViRequest request)
        {
            var donVi = await _context.DonVi.FindAsync(id);
            if (donVi == null) return false;

            donVi.MaDonVi = request.MaDonVi.Trim().ToUpperInvariant();
            donVi.TenDonVi = request.TenDonVi.Trim();
            donVi.DonViChaId = request.DonViChaId;
            donVi.LoaiDonVi = request.LoaiDonVi;
            donVi.Email = request.Email;
            donVi.SoDienThoai = request.SoDienThoai;
            donVi.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDonViAsync(long id)
        {
            var donVi = await _context.DonVi.Include(x => x.DonViCon).FirstOrDefaultAsync(x => x.Id == id);
            if (donVi == null) return false;

            // Kiểm tra có đơn vị con không
            if (donVi.DonViCon.Any())
            {
                throw new InvalidOperationException("Không thể xóa cơ quan/đơn vị đang có đơn vị trực thuộc!");
            }

            // Kiểm tra xem đã có PAKN gắn vào chưa
            var hasPakn = await _context.PAKN.AnyAsync(x => x.DonViTiepNhanId == id);
            if (hasPakn)
            {
                // Nếu đã có PAKN thì chuyển sang vô hiệu hóa (soft delete)
                donVi.IsActive = false;
            }
            else
            {
                _context.DonVi.Remove(donVi);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // ================= CRUD LĨNH VỰC =================
        public async Task<LinhVucDto> CreateLinhVucAsync(CreateLinhVucRequest request)
        {
            var linhVuc = new Domain.Entities.LinhVucPAKN
            {
                TenLinhVuc = request.TenLinhVuc.Trim(),
                MoTa = request.MoTa,
                IsActive = true
            };

            _context.LinhVucPAKN.Add(linhVuc);
            await _context.SaveChangesAsync();

            return new LinhVucDto
            {
                Id = linhVuc.Id,
                TenLinhVuc = linhVuc.TenLinhVuc,
                MoTa = linhVuc.MoTa
            };
        }

        public async Task<bool> UpdateLinhVucAsync(int id, UpdateLinhVucRequest request)
        {
            var linhVuc = await _context.LinhVucPAKN.FindAsync(id);
            if (linhVuc == null) return false;

            linhVuc.TenLinhVuc = request.TenLinhVuc.Trim();
            linhVuc.MoTa = request.MoTa;
            linhVuc.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLinhVucAsync(int id)
        {
            var linhVuc = await _context.LinhVucPAKN.Include(x => x.DanhSachChuDe).FirstOrDefaultAsync(x => x.Id == id);
            if (linhVuc == null) return false;

            if (linhVuc.DanhSachChuDe.Any())
            {
                throw new InvalidOperationException("Không thể xóa lĩnh vực đang có chủ đề kiến nghị con!");
            }

            _context.LinhVucPAKN.Remove(linhVuc);
            await _context.SaveChangesAsync();
            return true;
        }

        // ================= CRUD CHỦ ĐỀ =================
        public async Task<ChuDeDto> CreateChuDeAsync(CreateChuDeRequest request)
        {
            var chuDe = new Domain.Entities.ChuDePAKN
            {
                LinhVucId = request.LinhVucId,
                TenChuDe = request.TenChuDe.Trim(),
                ThoiGianXuLyMacDinhNgay = request.ThoiGianXuLyMacDinhNgay,
                IsActive = true
            };

            _context.ChuDePAKN.Add(chuDe);
            await _context.SaveChangesAsync();

            return new ChuDeDto
            {
                Id = chuDe.Id,
                TenChuDe = chuDe.TenChuDe,
                ThoiGianXuLyMacDinhNgay = chuDe.ThoiGianXuLyMacDinhNgay
            };
        }

        public async Task<bool> UpdateChuDeAsync(int id, UpdateChuDeRequest request)
        {
            var chuDe = await _context.ChuDePAKN.FindAsync(id);
            if (chuDe == null) return false;

            chuDe.LinhVucId = request.LinhVucId;
            chuDe.TenChuDe = request.TenChuDe.Trim();
            chuDe.ThoiGianXuLyMacDinhNgay = request.ThoiGianXuLyMacDinhNgay;
            chuDe.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteChuDeAsync(int id)
        {
            var chuDe = await _context.ChuDePAKN.FindAsync(id);
            if (chuDe == null) return false;

            var hasPakn = await _context.PAKN.AnyAsync(x => x.ChuDeId == id);
            if (hasPakn)
            {
                chuDe.IsActive = false; // Soft delete nếu đã có phản ánh
            }
            else
            {
                _context.ChuDePAKN.Remove(chuDe);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // ================= CRUD TỈNH / THÀNH PHỐ =================
        public async Task<TinhThanhDto> CreateTinhThanhAsync(CreateTinhThanhRequest request)
        {
            var tinh = new Domain.Entities.TinhThanh
            {
                MaTinh = request.MaTinh.Trim().ToUpperInvariant(),
                TenTinh = request.TenTinh.Trim(),
                IsActive = true
            };

            _context.TinhThanh.Add(tinh);
            await _context.SaveChangesAsync();

            return new TinhThanhDto
            {
                Id = tinh.Id,
                MaTinh = tinh.MaTinh,
                TenTinh = tinh.TenTinh
            };
        }

        public async Task<bool> UpdateTinhThanhAsync(int id, UpdateTinhThanhRequest request)
        {
            var tinh = await _context.TinhThanh.FindAsync(id);
            if (tinh == null) return false;

            tinh.MaTinh = request.MaTinh.Trim().ToUpperInvariant();
            tinh.TenTinh = request.TenTinh.Trim();
            tinh.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTinhThanhAsync(int id)
        {
            var tinh = await _context.TinhThanh.Include(x => x.DanhSachPhuongXa).FirstOrDefaultAsync(x => x.Id == id);
            if (tinh == null) return false;

            if (tinh.DanhSachPhuongXa.Any())
            {
                throw new InvalidOperationException("Không thể xóa Tỉnh/Thành phố đang có Phường/Xã trực thuộc!");
            }

            _context.TinhThanh.Remove(tinh);
            await _context.SaveChangesAsync();
            return true;
        }

        // ================= CRUD PHƯỜNG / XÃ (2 CẤP) =================
        public async Task<PhuongXaDto> CreatePhuongXaAsync(CreatePhuongXaRequest request)
        {
            var phuongXa = new Domain.Entities.PhuongXa
            {
                TinhThanhId = request.TinhThanhId,
                MaPhuongXa = request.MaPhuongXa.Trim().ToUpperInvariant(),
                TenPhuongXa = request.TenPhuongXa.Trim(),
                IsActive = true
            };

            _context.PhuongXa.Add(phuongXa);
            await _context.SaveChangesAsync();

            return new PhuongXaDto
            {
                Id = phuongXa.Id,
                MaPhuongXa = phuongXa.MaPhuongXa,
                TenPhuongXa = phuongXa.TenPhuongXa,
                TinhThanhId = phuongXa.TinhThanhId
            };
        }

        public async Task<bool> UpdatePhuongXaAsync(int id, UpdatePhuongXaRequest request)
        {
            var phuongXa = await _context.PhuongXa.FindAsync(id);
            if (phuongXa == null) return false;

            phuongXa.TinhThanhId = request.TinhThanhId;
            phuongXa.MaPhuongXa = request.MaPhuongXa.Trim().ToUpperInvariant();
            phuongXa.TenPhuongXa = request.TenPhuongXa.Trim();
            phuongXa.IsActive = request.IsActive;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePhuongXaAsync(int id)
        {
            var phuongXa = await _context.PhuongXa.FindAsync(id);
            if (phuongXa == null) return false;

            var hasNguoiGui = await _context.NguoiGui.AnyAsync(x => x.PhuongXaId == id);
            if (hasNguoiGui)
            {
                phuongXa.IsActive = false; // Soft delete nếu đã có hồ sơ người gửi liên kết
            }
            else
            {
                _context.PhuongXa.Remove(phuongXa);
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
