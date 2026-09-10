using Microsoft.EntityFrameworkCore;
using PAKN.Domain.Entities;

namespace PAKN.Infrastructure.Persistence
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (await context.TinhThanh.AnyAsync()) return;

            // 1. Seed Tỉnh/Thành phố
            var haNoi = new TinhThanh { MaTinh = "01", TenTinh = "Thành phố Hà Nội", IsActive = true };
            var hcm = new TinhThanh { MaTinh = "79", TenTinh = "Thành phố Hồ Chí Minh", IsActive = true };
            var daNang = new TinhThanh { MaTinh = "48", TenTinh = "Thành phố Đà Nẵng", IsActive = true };
            var haiPhong = new TinhThanh { MaTinh = "31", TenTinh = "Thành phố Hải Phòng", IsActive = true };
            var canTho = new TinhThanh { MaTinh = "92", TenTinh = "Thành phố Cần Thơ", IsActive = true };

            context.TinhThanh.AddRange(haNoi, hcm, daNang, haiPhong, canTho);
            await context.SaveChangesAsync();

            // 2. Seed Phường/Xã (Mô hình 2 cấp trực thuộc Tỉnh/TP)
            context.PhuongXa.AddRange(
                // Hà Nội
                new PhuongXa { MaPhuongXa = "00001", TenPhuongXa = "Phường Tràng Tiền", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00004", TenPhuongXa = "Phường Hàng Trống", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00160", TenPhuongXa = "Phường Cầu Giấy", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00163", TenPhuongXa = "Phường Nghĩa Đô", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00166", TenPhuongXa = "Phường Dịch Vọng", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00256", TenPhuongXa = "Phường Mễ Trì", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00300", TenPhuongXa = "Xã Tiên Dương", TinhThanhId = haNoi.Id },
                new PhuongXa { MaPhuongXa = "00405", TenPhuongXa = "Xã Bát Tràng", TinhThanhId = haNoi.Id },

                // TP.HCM
                new PhuongXa { MaPhuongXa = "26734", TenPhuongXa = "Phường Bến Nghé", TinhThanhId = hcm.Id },
                new PhuongXa { MaPhuongXa = "26740", TenPhuongXa = "Phường Bến Thành", TinhThanhId = hcm.Id },
                new PhuongXa { MaPhuongXa = "26743", TenPhuongXa = "Phường Tân Định", TinhThanhId = hcm.Id },
                new PhuongXa { MaPhuongXa = "26830", TenPhuongXa = "Phường Thảo Điền", TinhThanhId = hcm.Id },
                new PhuongXa { MaPhuongXa = "26833", TenPhuongXa = "Phường An Phú", TinhThanhId = hcm.Id },
                new PhuongXa { MaPhuongXa = "27430", TenPhuongXa = "Xã Bình Chánh", TinhThanhId = hcm.Id },

                // Đà Nẵng
                new PhuongXa { MaPhuongXa = "20194", TenPhuongXa = "Phường Hải Châu 1", TinhThanhId = daNang.Id },
                new PhuongXa { MaPhuongXa = "20197", TenPhuongXa = "Phường Thạch Thang", TinhThanhId = daNang.Id },
                new PhuongXa { MaPhuongXa = "20230", TenPhuongXa = "Phường An Hải Bắc", TinhThanhId = daNang.Id }
            );

            // 3. Seed Cơ quan / Đơn vị tiếp nhận
            var ubndHN = new DonVi { MaDonVi = "UBND-HN", TenDonVi = "UBND Thành phố Hà Nội", LoaiDonVi = 1 };
            var ubndHCM = new DonVi { MaDonVi = "UBND-HCM", TenDonVi = "UBND Thành phố Hồ Chí Minh", LoaiDonVi = 1 };
            var hoiDongCCTTHC = new DonVi { MaDonVi = "HD-TTHC", TenDonVi = "Hội đồng tư vấn cải cách thủ tục hành chính", LoaiDonVi = 2 };

            context.DonVi.AddRange(ubndHN, ubndHCM, hoiDongCCTTHC);
            await context.SaveChangesAsync();

            // Đơn vị trực thuộc
            context.DonVi.AddRange(
                new DonVi { MaDonVi = "STNMT-HN", TenDonVi = "Sở Tài nguyên và Môi trường Hà Nội", DonViChaId = ubndHN.Id, LoaiDonVi = 1 },
                new DonVi { MaDonVi = "SXD-HN", TenDonVi = "Sở Xây dựng Hà Nội", DonViChaId = ubndHN.Id, LoaiDonVi = 1 },
                new DonVi { MaDonVi = "SGTVT-HN", TenDonVi = "Sở Giao thông vận tải Hà Nội", DonViChaId = ubndHN.Id, LoaiDonVi = 1 },
                new DonVi { MaDonVi = "STTTT-HN", TenDonVi = "Sở Thông tin và Truyền thông Hà Nội", DonViChaId = ubndHN.Id, LoaiDonVi = 1 },

                new DonVi { MaDonVi = "STNMT-HCM", TenDonVi = "Sở Tài nguyên và Môi trường TP.HCM", DonViChaId = ubndHCM.Id, LoaiDonVi = 1 },
                new DonVi { MaDonVi = "SXD-HCM", TenDonVi = "Sở Xây dựng TP.HCM", DonViChaId = ubndHCM.Id, LoaiDonVi = 1 },
                new DonVi { MaDonVi = "SKHDT-HCM", TenDonVi = "Sở Kế hoạch và Đầu tư TP.HCM", DonViChaId = ubndHCM.Id, LoaiDonVi = 1 }
            );

            // 4. Seed Lĩnh vực & Chủ đề
            var moiTruong = new LinhVucPAKN { TenLinhVuc = "Tài nguyên và Môi trường", MoTa = "Các vấn đề về ô nhiễm, rác thải, đất đai" };
            moiTruong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Ô nhiễm không khí và khói bụi", ThoiGianXuLyMacDinhNgay = 10 });
            moiTruong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Xả thải nguồn nước và nước thải sinh hoạt", ThoiGianXuLyMacDinhNgay = 10 });
            moiTruong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Tập kết rác thải sai quy định", ThoiGianXuLyMacDinhNgay = 5 });
            moiTruong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Tranh chấp hoặc cấp phép đất đai", ThoiGianXuLyMacDinhNgay = 20 });

            var giaoThong = new LinhVucPAKN { TenLinhVuc = "Giao thông và Vận tải", MoTa = "Hạ tầng giao thông, phương tiện, biển báo" };
            giaoThong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Đường xá hư hỏng, sụt lún ổ gà", ThoiGianXuLyMacDinhNgay = 7 });
            giaoThong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Đèn tín hiệu hoặc biển báo bất hợp lý", ThoiGianXuLyMacDinhNgay = 5 });
            giaoThong.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Ùn tắc giao thông thường xuyên", ThoiGianXuLyMacDinhNgay = 15 });

            var tthc = new LinhVucPAKN { TenLinhVuc = "Thủ tục hành chính & Dịch vụ công", MoTa = "Thái độ phục vụ, chậm trễ hồ sơ, quy trình" };
            tthc.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Chậm trả kết quả giải quyết hồ sơ", ThoiGianXuLyMacDinhNgay = 5 });
            tthc.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Yêu cầu thêm giấy tờ ngoài quy định", ThoiGianXuLyMacDinhNgay = 7 });
            tthc.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Khó khăn khi thực hiện dịch vụ công trực tuyến", ThoiGianXuLyMacDinhNgay = 5 });

            var tratTuDoThi = new LinhVucPAKN { TenLinhVuc = "Trật tự đô thị & Xây dựng", MoTa = "Lấn chiếm vỉa hè, tiếng ồn, xây dựng trái phép" };
            tratTuDoThi.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Lấn chiếm lòng đường, vỉa hè kinh doanh", ThoiGianXuLyMacDinhNgay = 5 });
            tratTuDoThi.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Tiếng ồn quá mức sau 22h", ThoiGianXuLyMacDinhNgay = 3 });
            tratTuDoThi.DanhSachChuDe.Add(new ChuDePAKN { TenChuDe = "Công trình xây dựng không phép, sai phép", ThoiGianXuLyMacDinhNgay = 15 });

            context.LinhVucPAKN.AddRange(moiTruong, giaoThong, tthc, tratTuDoThi);
            await context.SaveChangesAsync();
        }
    }
}
