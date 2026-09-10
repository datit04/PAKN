using Microsoft.AspNetCore.Mvc;
using PAKN.Application.Interfaces;
using PAKN.Application.Services;

namespace PAKN.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucService _danhMucService;

        public DanhMucController(IDanhMucService danhMucService)
        {
            _danhMucService = danhMucService;
        }

        [HttpGet("tinh-thanh")]
        public async Task<IActionResult> GetTinhThanh()
        {
            var data = await _danhMucService.GetTinhThanhAsync();
            return Ok(data);
        }

        [HttpGet("phuong-xa")]
        public async Task<IActionResult> GetPhuongXa([FromQuery] int tinhThanhId, [FromQuery] string? keyword)
        {
            if (tinhThanhId <= 0) return BadRequest("Cần chọn Tỉnh/Thành phố!");
            var data = await _danhMucService.GetPhuongXaAsync(tinhThanhId, keyword);
            return Ok(data);
        }

        [HttpGet("don-vi-tiep-nhan")]
        public async Task<IActionResult> GetDonViTiepNhan([FromQuery] int? loaiDonVi)
        {
            var data = await _danhMucService.GetDonViTiepNhanAsync(loaiDonVi);
            return Ok(data);
        }

        [HttpGet("linh-vuc-chu-de")]
        public async Task<IActionResult> GetLinhVucVaChuDe()
        {
            var data = await _danhMucService.GetLinhVucVaChuDeAsync();
            return Ok(data);
        }

        // ================= CRUD ĐƠN VỊ =================
        [HttpPost("don-vi")]
        public async Task<IActionResult> CreateDonVi([FromBody] PAKN.Application.DTOs.CreateDonViRequest request)
        {
            try
            {
                var result = await _danhMucService.CreateDonViAsync(request);
                return Ok(new { success = true, data = result, message = "Thêm đơn vị thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("don-vi/{id}")]
        public async Task<IActionResult> UpdateDonVi(long id, [FromBody] PAKN.Application.DTOs.UpdateDonViRequest request)
        {
            try
            {
                var ok = await _danhMucService.UpdateDonViAsync(id, request);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy đơn vị!" });
                return Ok(new { success = true, message = "Cập nhật đơn vị thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("don-vi/{id}")]
        public async Task<IActionResult> DeleteDonVi(long id)
        {
            try
            {
                var ok = await _danhMucService.DeleteDonViAsync(id);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy đơn vị!" });
                return Ok(new { success = true, message = "Xóa đơn vị thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // ================= CRUD LĨNH VỰC =================
        [HttpPost("linh-vuc")]
        public async Task<IActionResult> CreateLinhVuc([FromBody] PAKN.Application.DTOs.CreateLinhVucRequest request)
        {
            try
            {
                var result = await _danhMucService.CreateLinhVucAsync(request);
                return Ok(new { success = true, data = result, message = "Thêm lĩnh vực thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("linh-vuc/{id}")]
        public async Task<IActionResult> UpdateLinhVuc(int id, [FromBody] PAKN.Application.DTOs.UpdateLinhVucRequest request)
        {
            try
            {
                var ok = await _danhMucService.UpdateLinhVucAsync(id, request);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy lĩnh vực!" });
                return Ok(new { success = true, message = "Cập nhật lĩnh vực thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("linh-vuc/{id}")]
        public async Task<IActionResult> DeleteLinhVuc(int id)
        {
            try
            {
                var ok = await _danhMucService.DeleteLinhVucAsync(id);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy lĩnh vực!" });
                return Ok(new { success = true, message = "Xóa lĩnh vực thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        // ================= CRUD CHỦ ĐỀ =================
        [HttpPost("chu-de")]
        public async Task<IActionResult> CreateChuDe([FromBody] PAKN.Application.DTOs.CreateChuDeRequest request)
        {
            try
            {
                var result = await _danhMucService.CreateChuDeAsync(request);
                return Ok(new { success = true, data = result, message = "Thêm chủ đề thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpPut("chu-de/{id}")]
        public async Task<IActionResult> UpdateChuDe(int id, [FromBody] PAKN.Application.DTOs.UpdateChuDeRequest request)
        {
            try
            {
                var ok = await _danhMucService.UpdateChuDeAsync(id, request);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy chủ đề!" });
                return Ok(new { success = true, message = "Cập nhật chủ đề thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("chu-de/{id}")]
        public async Task<IActionResult> DeleteChuDe(int id)
        {
            try
            {
                var ok = await _danhMucService.DeleteChuDeAsync(id);
                if (!ok) return NotFound(new { success = false, message = "Không tìm thấy chủ đề!" });
                return Ok(new { success = true, message = "Xóa chủ đề thành công!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class CaptchaController : ControllerBase
    {
        private readonly ICaptchaService _captchaService;

        public CaptchaController(ICaptchaService captchaService)
        {
            _captchaService = captchaService;
        }

        [HttpGet]
        public IActionResult GetCaptcha()
        {
            var (captchaId, base64) = _captchaService.GenerateCaptcha();
            return Ok(new { captchaId, image = base64 });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IStorageService _storageService;

        public UploadController(IStorageService storageService)
        {
            _storageService = storageService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile? file)
        {
            if (file == null || file.Length == 0) return BadRequest("Không có file nào được tải lên!");
            if (file.Length > 20 * 1024 * 1024) return BadRequest("Dung lượng file tối đa là 20MB!");

            using var stream = file.OpenReadStream();
            var (fileKey, originalName, size, contentType) = await _storageService.SaveFileAsync(stream, file.FileName, file.ContentType);

            return Ok(new
            {
                tenFile = originalName,
                duongDan = fileKey,
                dungLuong = size,
                loaiFile = contentType
            });
        }
    }
}
