using Microsoft.EntityFrameworkCore;
using PAKN.Application.DTOs;
using PAKN.Application.Interfaces;
using PAKN.Domain.Entities;
using PAKN.Domain.Enums;
using System.Security.Cryptography;
using System.Text;

namespace PAKN.Application.Services
{
    public interface IPaknService
    {
        Task<CreatePaknResponse> CreatePaknAsync(CreatePaknRequest request);
        Task<List<PaknChiTietResponse>> TraCuuChiTietAsync(TraCuuChiTietRequest request);
        Task<List<PaknCongKhaiDto>> GetDanhSachCongKhaiAsync(string? keyword, int page = 1, int pageSize = 10);
        Task<bool> DanhGiaPaknAsync(DanhGiaRequest request);
        
        // Admin operations
        Task<List<PaknChiTietResponse>> GetAllForAdminAsync(TrangThaiPAKN? trangThai = null);
        Task<bool> TiepNhanAsync(long id, string userId);
        Task<bool> PhanCongAsync(long id, PhanCongRequest request, string userId);
        Task<bool> SoanTraLoiAsync(long id, SoanTraLoiRequest request, string userId);
        Task<bool> DuyetTraLoiAsync(long id, DuyetTraLoiRequest request, string userId);
        Task<PaknChiTietResponse?> GetChiTietByIdAsync(long id);
        Task<bool> DeletePaknAsync(long id);
    }

    public class PaknService : IPaknService
    {
        private readonly IApplicationDbContext _context;
        private readonly ICaptchaService _captchaService;

        public PaknService(IApplicationDbContext context, ICaptchaService captchaService)
        {
            _context = context;
            _captchaService = captchaService;
        }

        public async Task<PaknChiTietResponse?> GetChiTietByIdAsync(long id)
        {
            var pakn = await _context.PAKN
                .Include(x => x.NguoiGui)
                .Include(x => x.DonViTiepNhan)
                .Include(x => x.ChuDe)
                .Include(x => x.Files)
                .Include(x => x.LichSuTrangThai.OrderBy(x => x.CreatedAt))
                .Include(x => x.DanhSachTraLoi.Where(x => x.IsPublished))
                    .ThenInclude(x => x.FilesDinhKem)
                .Include(x => x.DanhGia)
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.IsCongKhai
                );

            if (pakn == null)
            {
                return null;
            }

            return new PaknChiTietResponse
            {
                Id = pakn.Id,
                MaPAKN = pakn.MaPAKN,
                DoiTuongPAKN = pakn.DoiTuongPAKN,
                TieuDe = pakn.TieuDe,
                NoiDung = pakn.NoiDung,
                TrangThai = pakn.TrangThai,
                NgayGui = pakn.NgayGui,
                HanXuLy = pakn.HanXuLy,

                TenDonViTiepNhan = pakn.DonViTiepNhan?.TenDonVi ?? "",
                TenChuDe = pakn.ChuDe?.TenChuDe,

                NguoiGui = new NguoiGuiDto
                {
                    HoTen = pakn.IsAnDanh ? "Người dân ẩn danh" : pakn.NguoiGui?.HoTen,
                    TenDoanhNghiep = pakn.IsAnDanh ? null : pakn.NguoiGui?.TenDoanhNghiep,
                    TenToChuc = pakn.IsAnDanh ? null : pakn.NguoiGui?.TenToChuc,
                    SoDienThoai = "",
                    Email = null,
                    DiaChiChiTiet = null
                },

                Files = pakn.Files
                    .Where(x => x.LoaiDinhKem == LoaiDinhKem.NguoiDanGui)
                    .Select(x => new FileAttachmentDto
                    {
                        TenFile = x.TenFile,
                        DuongDan = x.DuongDan,
                        DungLuong = x.DungLuong ?? 0,
                        LoaiFile = x.LoaiFile ?? ""
                    })
                    .ToList(),

                LichSu = pakn.LichSuTrangThai
                    .Select(x => new LichSuTrangThaiDto
                    {
                        TrangThaiCu = x.TrangThaiCu,
                        TrangThaiMoi = x.TrangThaiMoi,
                        GhiChu = x.GhiChu,
                        CreatedAt = x.CreatedAt
                    })
                    .ToList(),

                TraLoi = pakn.DanhSachTraLoi
                    .Select(x => new TraLoiDto
                    {
                        SoCongVanTraLoi = x.SoCongVanTraLoi,
                        NoiDungTraLoi = x.NoiDungTraLoi,
                        NgayDuyet = x.NgayDuyet,
                        FilesDinhKem = x.FilesDinhKem
                            .Select(file => new FileAttachmentDto
                            {
                                TenFile = file.TenFile,
                                DuongDan = file.DuongDan,
                                DungLuong = file.DungLuong ?? 0,
                                LoaiFile = file.LoaiFile ?? ""
                            })
                            .ToList()
                    })
                    .ToList(),

                DanhGia = pakn.DanhGia == null
                    ? null
                    : new DanhGiaDto
                    {
                        MucDoHaiLong = pakn.DanhGia.MucDoHaiLong,
                        NoiDungGopY = pakn.DanhGia.NoiDungGopY,
                        NgayDanhGia = pakn.DanhGia.NgayDanhGia
                    }
            };
        }

        public async Task<bool> DeletePaknAsync(long id)
        {
            var pakn = await _context.PAKN
                .Include(x => x.Files)
                .Include(x => x.LichSuTrangThai)
                .Include(x => x.DanhSachTraLoi)
                    .ThenInclude(x => x.FilesDinhKem)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (pakn == null)
                return false;

            // Xóa các file đính kèm của PAKN
            if (pakn.Files.Any())
            {
                _context.PAKN_File.RemoveRange(pakn.Files);
            }

            // Xóa lịch sử trạng thái
            if (pakn.LichSuTrangThai.Any())
            {
                _context.PAKN_LichSuTrangThai.RemoveRange(pakn.LichSuTrangThai);
            }

            // Xóa các câu trả lời và file đính kèm của câu trả lời
            foreach (var traLoi in pakn.DanhSachTraLoi)
            {
                if (traLoi.FilesDinhKem.Any())
                {
                    _context.PAKN_File.RemoveRange(traLoi.FilesDinhKem);
                }
            }

            if (pakn.DanhSachTraLoi.Any())
            {
                _context.PAKN_TraLoi.RemoveRange(pakn.DanhSachTraLoi);
            }

            // Lưu lại NguoiGuiId trước khi xóa PAKN
            var nguoiGuiId = pakn.NguoiGuiId;

            // Xóa PAKN
            _context.PAKN.Remove(pakn);

            await _context.SaveChangesAsync();

            // Nếu NguoiGui chỉ thuộc về PAKN này thì có thể xóa
            var nguoiGui = await _context.NguoiGui.FindAsync(nguoiGuiId);

            if (nguoiGui != null)
            {
                _context.NguoiGui.Remove(nguoiGui);
                await _context.SaveChangesAsync();
            }

            return true;
        }

        public async Task<CreatePaknResponse> CreatePaknAsync(CreatePaknRequest request)
        {
            if (!_captchaService.ValidateCaptcha(request.CaptchaId, request.CaptchaCode))
            {
                throw new ArgumentException("Mã bảo mật không chính xác hoặc đã hết hạn!");
            }

            var nguoiGui = new NguoiGui
            {
                LoaiNguoiGui = request.DoiTuongPAKN,
                HoTen = request.NguoiGui.HoTen,
                TenDoanhNghiep = request.NguoiGui.TenDoanhNghiep,
                TenToChuc = request.NguoiGui.TenToChuc,
                SoDienThoai = request.NguoiGui.SoDienThoai,
                Email = request.NguoiGui.Email,
                TinhThanhId = request.NguoiGui.TinhThanhId,
                PhuongXaId = request.NguoiGui.PhuongXaId,
                DiaChiChiTiet = request.NguoiGui.DiaChiChiTiet,
                BoDiaPhuongId = request.NguoiGui.BoDiaPhuongId,
                DonViTrucThuocId = request.NguoiGui.DonViTrucThuocId,
                CreatedAt = DateTime.Now
            };
            _context.NguoiGui.Add(nguoiGui);
            await _context.SaveChangesAsync();

            var nam = DateTime.Now.Year;

            var lastMaPAKN = await _context.PAKN
                .Where(x => x.MaPAKN.StartsWith($"PAKN-{nam}-"))
                .OrderByDescending(x => x.MaPAKN)
                .Select(x => x.MaPAKN)
                .FirstOrDefaultAsync();

            int soThuTu = 1;

            if (!string.IsNullOrEmpty(lastMaPAKN))
            {
                var phanSo = lastMaPAKN.Substring(10);
                soThuTu = int.Parse(phanSo) + 1;
            }

            var maPAKN = $"PAKN-{nam}-{soThuTu:D6}";

            var maBiMat = GenerateSecretCode(6);

            DateTime? hanXuLy = null;
            if (request.ChuDeId.HasValue)
            {
                var chuDe = await _context.ChuDePAKN.FindAsync(request.ChuDeId.Value);
                if (chuDe != null)
                {
                    hanXuLy = DateTime.Now.AddDays(chuDe.ThoiGianXuLyMacDinhNgay);
                }
            }

            var pakn = new PAKN.Domain.Entities.PAKN
            {
                MaPAKN = maPAKN,
                MaBiMat = maBiMat,
                DoiTuongPAKN = request.DoiTuongPAKN,
                NguoiGuiId = nguoiGui.Id,
                ChuDeId = request.ChuDeId,
                TieuDe = request.TieuDe,
                NoiDung = request.NoiDung,
                DonViTiepNhanId = request.DonViTiepNhanId,
                TrangThai = TrangThaiPAKN.MoiTiepNhan,
                HanXuLy = hanXuLy,
                IsAnDanh = request.IsAnDanh,
                NgayGui = DateTime.Now,
                CreatedAt = DateTime.Now
            };

            foreach (var f in request.Files)
            {
                pakn.Files.Add(new PAKN_File
                {
                    TenFile = f.TenFile,
                    TenFileLuuTru = Path.GetFileName(f.DuongDan),
                    DuongDan = f.DuongDan,
                    DungLuong = f.DungLuong,
                    LoaiFile = f.LoaiFile,
                    LoaiDinhKem = LoaiDinhKem.NguoiDanGui,
                    CreatedAt = DateTime.Now
                });
            }

            pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
            {
                TrangThaiMoi = TrangThaiPAKN.MoiTiepNhan,
                GhiChu = "Gửi phản ánh kiến nghị thành công qua Cổng tiếp nhận",
                CreatedAt = DateTime.Now
            });

            _context.PAKN.Add(pakn);
            await _context.SaveChangesAsync();

            return new CreatePaknResponse
            {
                MaPAKN = maPAKN,
                MaBiMat = maBiMat,
                NgayGui = pakn.NgayGui,
                Message = "Gửi phản ánh thành công! Vui lòng lưu lại Mã PAKN và Mã bí mật để tra cứu."
            };
        }

        public async Task<List<PaknChiTietResponse>> TraCuuChiTietAsync(TraCuuChiTietRequest request)
        {
            var tuKhoa = request.NguoiGui?.Trim();

            var query = _context.PAKN
                .Include(x => x.NguoiGui)
                .Include(x => x.DonViTiepNhan)
                .Include(x => x.ChuDe)
                .Include(x => x.Files)
                .Include(x => x.LichSuTrangThai.OrderBy(l => l.CreatedAt))
                .Include(x => x.DanhSachTraLoi.Where(t => t.IsPublished))
                    .ThenInclude(t => t.FilesDinhKem)
                .Include(x => x.DanhGia)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.MaPAKN))
            {
                query = query.Where(x => x.MaPAKN == request.MaPAKN.Trim());
            }
            else if (!string.IsNullOrWhiteSpace(tuKhoa))
            {
                query = query.Where(x =>
                    (x.NguoiGui.HoTen != null && x.NguoiGui.HoTen.Contains(tuKhoa)) ||
                    (x.NguoiGui.TenDoanhNghiep != null && x.NguoiGui.TenDoanhNghiep.Contains(tuKhoa)) ||
                    (x.NguoiGui.TenToChuc != null && x.NguoiGui.TenToChuc.Contains(tuKhoa))
                );
            }
            else
            {
                return new List<PaknChiTietResponse>();
            }

            var listPakn = await query.ToListAsync();

            return listPakn.Select(pakn => new PaknChiTietResponse
            {
                Id = pakn.Id,
                MaPAKN = pakn.MaPAKN,
                DoiTuongPAKN = pakn.DoiTuongPAKN,
                TieuDe = pakn.TieuDe,
                NoiDung = pakn.NoiDung,
                TrangThai = pakn.TrangThai,
                NgayGui = pakn.NgayGui,
                HanXuLy = pakn.HanXuLy,
                TenDonViTiepNhan = pakn.DonViTiepNhan?.TenDonVi ?? "",
                TenChuDe = pakn.ChuDe?.TenChuDe,
                NguoiGui = new NguoiGuiDto
                {
                    HoTen = pakn.NguoiGui?.HoTen,
                    TenDoanhNghiep = pakn.NguoiGui?.TenDoanhNghiep,
                    TenToChuc = pakn.NguoiGui?.TenToChuc,
                    SoDienThoai = pakn.NguoiGui?.SoDienThoai ?? "",
                    Email = pakn.NguoiGui?.Email,
                    DiaChiChiTiet = pakn.NguoiGui?.DiaChiChiTiet
                },
                Files = pakn.Files
                    .Where(f => f.LoaiDinhKem == LoaiDinhKem.NguoiDanGui)
                    .Select(f => new FileAttachmentDto
                    {
                        TenFile = f.TenFile,
                        DuongDan = f.DuongDan,
                        DungLuong = f.DungLuong ?? 0,
                        LoaiFile = f.LoaiFile ?? ""
                    }).ToList(),
                LichSu = pakn.LichSuTrangThai.Select(l => new LichSuTrangThaiDto
                {
                    TrangThaiCu = l.TrangThaiCu,
                    TrangThaiMoi = l.TrangThaiMoi,
                    GhiChu = l.GhiChu,
                    CreatedAt = l.CreatedAt
                }).ToList(),
                TraLoi = pakn.DanhSachTraLoi.Select(t => new TraLoiDto
                {
                    SoCongVanTraLoi = t.SoCongVanTraLoi,
                    NoiDungTraLoi = t.NoiDungTraLoi,
                    NgayDuyet = t.NgayDuyet,
                    FilesDinhKem = t.FilesDinhKem.Select(tf => new FileAttachmentDto
                    {
                        TenFile = tf.TenFile,
                        DuongDan = tf.DuongDan,
                        DungLuong = tf.DungLuong ?? 0,
                        LoaiFile = tf.LoaiFile ?? ""
                    }).ToList()
                }).ToList(),
                DanhGia = pakn.DanhGia != null ? new DanhGiaDto
                {
                    MucDoHaiLong = pakn.DanhGia.MucDoHaiLong,
                    NoiDungGopY = pakn.DanhGia.NoiDungGopY,
                    NgayDanhGia = pakn.DanhGia.NgayDanhGia
                } : null
            }).ToList();
        }

        public async Task<List<PaknCongKhaiDto>> GetDanhSachCongKhaiAsync(string? keyword, int page = 1, int pageSize = 10)
        {
            var query = _context.PAKN
                .Include(x => x.NguoiGui)
                .Include(x => x.DonViTiepNhan)
                .Include(x => x.DanhSachTraLoi.Where(t => t.IsPublished))
                .Where(x => x.IsCongKhai);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(x => x.TieuDe.Contains(keyword) || x.MaPAKN.Contains(keyword) || x.NoiDung.Contains(keyword));
            }

            var items = await query
                .OrderByDescending(x => x.NgayGui)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return items.Select(x =>
            {
                var traLoiMoiNhat = x.DanhSachTraLoi.OrderByDescending(t => t.NgayDuyet).FirstOrDefault();
                var tenNguoiGui = x.IsAnDanh ? "Người dân ẩn danh" : CheThongTinNguoiGui(x.NguoiGui?.HoTen ?? x.NguoiGui?.TenDoanhNghiep ?? "Công dân");

                return new PaknCongKhaiDto
                {
                    MaPAKN = x.MaPAKN,
                    TieuDe = x.TieuDe,
                    NoiDung = x.NoiDung.Length > 200 ? x.NoiDung.Substring(0, 197) + "..." : x.NoiDung,
                    TenDonViTiepNhan = x.DonViTiepNhan?.TenDonVi ?? "",
                    NguoiGuiChe = tenNguoiGui,
                    TrangThai = x.TrangThai,
                    NgayGui = x.NgayGui,
                    CauTraLoiMoiNhat = traLoiMoiNhat?.NoiDungTraLoi,
                    NgayTraLoi = traLoiMoiNhat?.NgayDuyet
                };
            }).ToList();
        }

        public async Task<bool> DanhGiaPaknAsync(DanhGiaRequest request)
        {
            var pakn = await _context.PAKN
                .Include(x => x.DanhGia)
                .FirstOrDefaultAsync(x => x.MaPAKN == request.MaPAKN && x.MaBiMat == request.MaBiMat);

            if (pakn == null) return false;
            if (pakn.DanhGia != null) throw new InvalidOperationException("Phản ánh này đã được đánh giá!");

            var danhGia = new PAKN_DanhGia
            {
                PAKNId = pakn.Id,
                MucDoHaiLong = request.MucDoHaiLong,
                TieuChiThoiGian = request.TieuChiThoiGian,
                TieuChiThaiDo = request.TieuChiThaiDo,
                NoiDungGopY = request.NoiDungGopY,
                NgayDanhGia = DateTime.Now
            };

            _context.PAKN_DanhGia.Add(danhGia);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<PaknChiTietResponse>> GetAllForAdminAsync(TrangThaiPAKN? trangThai = null)
        {
            var query = _context.PAKN
                .Include(x => x.NguoiGui)
                .Include(x => x.DonViTiepNhan)
                .Include(x => x.ChuDe)
                .Include(x => x.Files)
                .Include(x => x.LichSuTrangThai)
                .Include(x => x.DanhSachTraLoi)
                .AsQueryable();

            if (trangThai.HasValue)
            {
                query = query.Where(x => x.TrangThai == trangThai.Value);
            }

            var list = await query.OrderByDescending(x => x.NgayGui).ToListAsync();
            return list.Select(pakn => new PaknChiTietResponse
            {
                Id = pakn.Id,
                MaPAKN = pakn.MaPAKN,
                DoiTuongPAKN = pakn.DoiTuongPAKN,
                TieuDe = pakn.TieuDe,
                NoiDung = pakn.NoiDung,
                TrangThai = pakn.TrangThai,
                NgayGui = pakn.NgayGui,
                HanXuLy = pakn.HanXuLy,
                TenDonViTiepNhan = pakn.DonViTiepNhan?.TenDonVi ?? "",
                TenChuDe = pakn.ChuDe?.TenChuDe,
                NguoiGui = new NguoiGuiDto
                {
                    HoTen = pakn.NguoiGui?.HoTen,
                    TenDoanhNghiep = pakn.NguoiGui?.TenDoanhNghiep,
                    TenToChuc = pakn.NguoiGui?.TenToChuc,
                    SoDienThoai = pakn.NguoiGui?.SoDienThoai ?? "",
                    Email = pakn.NguoiGui?.Email,
                    DiaChiChiTiet = pakn.NguoiGui?.DiaChiChiTiet
                }
            }).ToList();
        }

        public async Task<bool> TiepNhanAsync(long id, string userId)
        {
            var pakn = await _context.PAKN.FindAsync(id);
            if (pakn == null) return false;

            var cu = pakn.TrangThai;
            pakn.TrangThai = TrangThaiPAKN.DaTiepNhan;
            pakn.NgayTiepNhan = DateTime.Now;

            pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
            {
                TrangThaiCu = cu,
                TrangThaiMoi = TrangThaiPAKN.DaTiepNhan,
                NguoiThucHienId = userId,
                GhiChu = "Đã tiếp nhận hồ sơ vào hệ thống",
                CreatedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PhanCongAsync(long id, PhanCongRequest request, string userId)
        {
            var pakn = await _context.PAKN.FindAsync(id);
            if (pakn == null) return false;

            var phanCong = new PAKN_PhanCong
            {
                PAKNId = pakn.Id,
                DonViId = request.DonViId,
                NguoiXuLyId = request.NguoiXuLyId,
                LoaiPhanCong = request.LoaiPhanCong,
                NoiDungGiaoViec = request.NoiDungGiaoViec,
                HanXuLy = request.HanXuLy ?? pakn.HanXuLy,
                NguoiGiaoId = userId,
                NgayPhanCong = DateTime.Now,
                TrangThai = 1
            };

            var cu = pakn.TrangThai;
            pakn.TrangThai = TrangThaiPAKN.DangXuLy;
            pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
            {
                TrangThaiCu = cu,
                TrangThaiMoi = TrangThaiPAKN.DangXuLy,
                NguoiThucHienId = userId,
                GhiChu = $"Phân công xử lý: {request.NoiDungGiaoViec}",
                CreatedAt = DateTime.Now
            });

            _context.PAKN_PhanCong.Add(phanCong);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SoanTraLoiAsync(long id, SoanTraLoiRequest request, string userId)
        {
            var pakn = await _context.PAKN.FindAsync(id);
            if (pakn == null) return false;

            var traLoi = new PAKN_TraLoi
            {
                PAKNId = pakn.Id,
                SoCongVanTraLoi = request.SoCongVanTraLoi,
                NoiDungTraLoi = request.NoiDungTraLoi,
                NguoiSoanId = userId,
                IsPublished = false,
                CreatedAt = DateTime.Now
            };

            foreach (var f in request.FilesDinhKem)
            {
                traLoi.FilesDinhKem.Add(new PAKN_File
                {
                    PAKNId = pakn.Id,
                    LoaiDinhKem = LoaiDinhKem.VanBanTraLoi,
                    TenFile = f.TenFile,
                    TenFileLuuTru = Path.GetFileName(f.DuongDan),
                    DuongDan = f.DuongDan,
                    DungLuong = f.DungLuong,
                    LoaiFile = f.LoaiFile,
                    CreatedAt = DateTime.Now
                });
            }

            var cu = pakn.TrangThai;
            pakn.TrangThai = TrangThaiPAKN.DaCoKetQua;
            pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
            {
                TrangThaiCu = cu,
                TrangThaiMoi = TrangThaiPAKN.DaCoKetQua,
                NguoiThucHienId = userId,
                GhiChu = "Đã soạn văn bản trả lời, chuyển lãnh đạo phê duyệt",
                CreatedAt = DateTime.Now
            });

            _context.PAKN_TraLoi.Add(traLoi);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DuyetTraLoiAsync(long id, DuyetTraLoiRequest request, string userId)
        {
            var pakn = await _context.PAKN.Include(x => x.DanhSachTraLoi).FirstOrDefaultAsync(x => x.Id == id);
            if (pakn == null) return false;

            var traLoi = request.TraLoiId > 0 
                ? pakn.DanhSachTraLoi.FirstOrDefault(x => x.Id == request.TraLoiId)
                : pakn.DanhSachTraLoi.OrderByDescending(x => x.CreatedAt).FirstOrDefault();
            if (traLoi == null) return false;

            var cu = pakn.TrangThai;
            if (request.IsApprove)
            {
                traLoi.IsPublished = true;
                traLoi.NguoiDuyetId = userId;
                traLoi.NgayDuyet = DateTime.Now;

                pakn.TrangThai = TrangThaiPAKN.HoanThanh;
                pakn.NgayHoanThanh = DateTime.Now;

                pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
                {
                    TrangThaiCu = cu,
                    TrangThaiMoi = TrangThaiPAKN.HoanThanh,
                    NguoiThucHienId = userId,
                    GhiChu = "Lãnh đạo đã phê duyệt và công khai câu trả lời tới người dân",
                    CreatedAt = DateTime.Now
                });
            }
            else
            {
                pakn.TrangThai = TrangThaiPAKN.DangXuLy;
                pakn.LichSuTrangThai.Add(new PAKN_LichSuTrangThai
                {
                    TrangThaiCu = cu,
                    TrangThaiMoi = TrangThaiPAKN.DangXuLy,
                    NguoiThucHienId = userId,
                    GhiChu = $"Yêu cầu chỉnh sửa lại câu trả lời: {request.GhiChu}",
                    CreatedAt = DateTime.Now
                });
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private static string GenerateSecretCode(int length)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var bytes = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);
            var sb = new StringBuilder(length);
            foreach (var b in bytes)
            {
                sb.Append(chars[b % chars.Length]);
            }
            return sb.ToString();
        }

        private static string CheThongTinNguoiGui(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return "Công dân";
            var parts = text.Trim().Split(' ');
            if (parts.Length <= 1) return text[0] + "***";
            return $"{parts[0]} *** {parts[^1]}";
        }
    }
}
