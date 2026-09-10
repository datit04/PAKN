using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using PAKN.Application.Interfaces;
using PAKN.Application.Services;
using PAKN.Infrastructure.Persistence;
using PAKN.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database & Persistence
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Database=PAKN_System_Db;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

// 2. Caching, Storage & Captcha
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<ICaptchaService, SimpleCaptchaService>();
builder.Services.AddSingleton<IStorageService, LocalStorageService>();

// 3. Application Services
builder.Services.AddScoped<IDanhMucService, DanhMucService>();
builder.Services.AddScoped<IPaknService, PaknService>();

// 4. Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 5. CORS cho React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Tự động đảm bảo DB được tạo và seed data ban đầu
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        context.Database.EnsureCreated();
        await DbInitializer.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi khi khởi tạo hoặc seed dữ liệu Database.");
    }
}

// Cấu hình Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Cung cấp file static trong thư mục uploads
var uploadDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "uploads");
if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadDir),
    RequestPath = "/uploads"
});

app.UseAuthorization();
app.MapControllers();

app.Run();
