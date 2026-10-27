using Microsoft.AspNetCore.Mvc;
using PAKN.Application.DTOs;
using PAKN.Application.Services;
using PAKN.Domain.Enums;

namespace PAKN.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PAKNController : ControllerBase
    {
        private readonly IPaknService _paknService;

        public PAKNController(IPaknService paknService)
        {
            _paknService = paknService;
        }

        [HttpGet("detail")]
        public async Task<IActionResult> GetDetail([FromQuery] long id)
        {
            var result = await _paknService.GetChiTietByIdAsync(id);

            if (result == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy phản ánh"
                });
            }

            return Ok(new
            {
                success = true,
                data = result
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreatePakn([FromBody] CreatePaknRequest request)
        {
            try
            {
                var result = await _paknService.CreatePaknAsync(request);
                return Ok(new { success = true, data = result });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePakn(long id)
        {
            var result = await _paknService.DeletePaknAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy phản ánh kiến nghị."
                });
            }

            return Ok(new
            {
                message = "Xóa phản ánh kiến nghị thành công."
            });
        }

        [HttpPost("tra-cuu")]
        public async Task<IActionResult> TraCuuChiTiet([FromBody] TraCuuChiTietRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.MaPAKN) && string.IsNullOrWhiteSpace(request.NguoiGui))
            {
                return BadRequest(new { success = false, message = "Vui lòng nhập mã PAKN hoặc tên người gửi" });
            }

            var listPakn = await _paknService.TraCuuChiTietAsync(request);

            if (listPakn == null || !listPakn.Any())
            {
                return NotFound(new { success = false, message = "Không tìm thấy phản ánh kiến nghị!" });
            }

            return Ok(new { success = true, data = listPakn });
        }

        [HttpGet("cong-khai")]
        public async Task<IActionResult> GetDanhSachCongKhai([FromQuery] string? keyword, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var data = await _paknService.GetDanhSachCongKhaiAsync(keyword, page, pageSize);
            return Ok(new { success = true, data });
        }

        [HttpPost("danh-gia")]
        public async Task<IActionResult> DanhGia([FromBody] DanhGiaRequest request)
        {
            try
            {
                var ok = await _paknService.DanhGiaPaknAsync(request);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy phản ánh hoặc mã bí mật không hợp lệ!" });
                return Ok(new { success = true, message = "Cảm ơn bạn đã gửi đánh giá ý kiến!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IPaknService _paknService;

        public AdminController(IPaknService paknService)
        {
            _paknService = paknService;
        }

        [HttpGet("danh-sach")]
        public async Task<IActionResult> GetAll([FromQuery] TrangThaiPAKN? trangThai)
        {
            var data = await _paknService.GetAllForAdminAsync(trangThai);
            return Ok(new { success = true, data });
        }

        [HttpGet("thong-ke")]
        public async Task<IActionResult> GetThongKe()
        {
            var data = await _paknService.GetThongKeAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("{id}/tiep-nhan")]
        public async Task<IActionResult> TiepNhan(long id, [FromQuery] string? userId = "CB_TIEP_NHAN")
        {
            var ok = await _paknService.TiepNhanAsync(id, userId ?? "CB_TIEP_NHAN");
            if (!ok) return NotFound(new { success = false, message = "Không tìm thấy PAKN!" });
            return Ok(new { success = true, message = "Đã tiếp nhận hồ sơ vào hệ thống!" });
        }

        [HttpPost("{id}/phan-cong")]
        public async Task<IActionResult> PhanCong(long id, [FromBody] PhanCongRequest request, [FromQuery] string? userId = "LANH_DAO")
        {
            var ok = await _paknService.PhanCongAsync(id, request, userId ?? "LANH_DAO");
            if (!ok) return NotFound(new { success = false, message = "Không tìm thấy PAKN!" });
            return Ok(new { success = true, message = "Đã phân công xử lý thành công!" });
        }

        [HttpPost("{id}/soan-tra-loi")]
        public async Task<IActionResult> SoanTraLoi(long id, [FromBody] SoanTraLoiRequest request, [FromQuery] string? userId = "CHUYEN_VIEN")
        {
            var ok = await _paknService.SoanTraLoiAsync(id, request, userId ?? "CHUYEN_VIEN");
            if (!ok) return NotFound(new { success = false, message = "Không tìm thấy PAKN!" });
            return Ok(new { success = true, message = "Đã lưu bản thảo văn bản trả lời, chờ phê duyệt!" });
        }

        [HttpPost("{id}/duyet-tra-loi")]
        public async Task<IActionResult> DuyetTraLoi(long id, [FromBody] DuyetTraLoiRequest request, [FromQuery] string? userId = "LANH_DAO_KY")
        {
            var ok = await _paknService.DuyetTraLoiAsync(id, request, userId ?? "LANH_DAO_KY");
            if (!ok) return NotFound(new { success = false, message = "Không tìm thấy PAKN hoặc văn bản trả lời!" });
            return Ok(new { success = true, message = request.IsApprove ? "Đã phê duyệt và công khai câu trả lời!" : "Đã yêu cầu chỉnh sửa lại câu trả lời!" });
        }
    }
}
