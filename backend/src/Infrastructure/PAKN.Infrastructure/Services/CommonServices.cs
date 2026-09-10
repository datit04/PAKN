using Microsoft.Extensions.Caching.Memory;
using PAKN.Application.Interfaces;
using System.Security.Cryptography;
using System.Text;

namespace PAKN.Infrastructure.Services
{
    public class SimpleCaptchaService : ICaptchaService
    {
        private readonly IMemoryCache _cache;
        private static readonly char[] Characters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ".ToCharArray();

        public SimpleCaptchaService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public (string CaptchaId, string Base64Image) GenerateCaptcha()
        {
            var captchaId = Guid.NewGuid().ToString("N");
            var code = GenerateRandomCode(5);

            _cache.Set($"captcha_{captchaId}", code.ToUpperInvariant(), TimeSpan.FromMinutes(5));

            var svg = $@"<svg xmlns=""http://www.w3.org/2000/svg"" width=""150"" height=""45"" viewBox=""0 0 150 45"">
                <rect width=""100%"" height=""100%"" fill=""#f3f4f6"" rx=""6""/>
                <path d=""M 10 20 Q 50 5 90 25 T 140 30"" fill=""none"" stroke=""#9ca3af"" stroke-width=""2""/>
                <path d=""M 20 35 Q 70 40 120 15 T 145 20"" fill=""none"" stroke=""#d1d5db"" stroke-width=""1.5""/>
                <text x=""50%"" y=""58%"" dominant-baseline=""middle"" text-anchor=""middle"" 
                      font-family=""Arial, sans-serif"" font-size=""24"" font-weight=""bold"" fill=""#1e3a8a"" letter-spacing=""6"">
                    {code}
                </text>
            </svg>";

            var base64 = "data:image/svg+xml;base64," + Convert.ToBase64String(Encoding.UTF8.GetBytes(svg));
            return (captchaId, base64);
        }

        public bool ValidateCaptcha(string captchaId, string code)
        {
            if (string.IsNullOrWhiteSpace(captchaId) || string.IsNullOrWhiteSpace(code)) return false;

            var cacheKey = $"captcha_{captchaId}";
            if (_cache.TryGetValue<string>(cacheKey, out var expectedCode))
            {
                _cache.Remove(cacheKey);
                return string.Equals(expectedCode, code.Trim().ToUpperInvariant(), StringComparison.OrdinalIgnoreCase);
            }

            return false;
        }

        private static string GenerateRandomCode(int length)
        {
            var sb = new StringBuilder(length);
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[length];
            rng.GetBytes(bytes);

            for (int i = 0; i < length; i++)
            {
                sb.Append(Characters[bytes[i] % Characters.Length]);
            }
            return sb.ToString();
        }
    }

    public class LocalStorageService : IStorageService
    {
        private readonly string _uploadFolder;

        public LocalStorageService()
        {
            _uploadFolder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "uploads");
            if (!Directory.Exists(_uploadFolder))
            {
                Directory.CreateDirectory(_uploadFolder);
            }
        }

        public async Task<(string FileKey, string OriginalName, long Size, string ContentType)> SaveFileAsync(Stream fileStream, string fileName, string contentType)
        {
            var extension = Path.GetExtension(fileName);
            var safeName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(_uploadFolder, safeName);

            using var target = new FileStream(filePath, FileMode.Create, FileAccess.Write);
            await fileStream.CopyToAsync(target);

            var fileKey = $"/uploads/{safeName}";
            return (fileKey, fileName, fileStream.Length, contentType);
        }

        public Task<Stream?> GetFileAsync(string fileKey)
        {
            var fileName = Path.GetFileName(fileKey);
            var filePath = Path.Combine(_uploadFolder, fileName);
            if (File.Exists(filePath))
            {
                Stream stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
                return Task.FromResult<Stream?>(stream);
            }
            return Task.FromResult<Stream?>(null);
        }
    }
}
