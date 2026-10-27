# CLAUDE.md
- Hãy trả lời tôi bằng Tiếng Việt nhé
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

PAKN is a Vietnamese government citizen feedback/petition portal ("Phản Ánh Kiến Nghị" — Reflections & Recommendations), for the "2-cấp" (two-tier) local government model (Tỉnh/Thành → Phường/Xã, no district level). Citizens submit complaints/petitions (PAKN) that get routed to receiving units (Đơn vị), tracked through a status workflow, answered, and optionally published publicly.

The repo is a monorepo with two independently-run apps:
- `backend/` — .NET 8 Web API (Clean Architecture)
- `frontend/` — React + TypeScript SPA (Vite)

There is no root-level build orchestration; each app is built/run from its own directory.

## Commands

### Backend (`backend/`)
```powershell
cd backend
dotnet build
dotnet run --project src/Presentation/PAKN.WebAPI
```
- Runs on `http://localhost:5000`; Swagger UI at `/swagger` (Development only).
- On startup, `Program.cs` calls `context.Database.EnsureCreated()` and `DbInitializer.SeedAsync()` — the DB and seed data (Vietnamese provinces/wards, sample units, sample fields/topics) are created automatically on first run. There are no EF Core migrations in this project; schema changes are made directly on the entity/`OnModelCreating` config and picked up via `EnsureCreated`.
- Requires SQL Server. Connection string is configured in `src/Presentation/PAKN.WebAPI/appsettings.json` (`ConnectionStrings:DefaultConnection`).
- No test project currently exists in `PAKN.sln`.

### Frontend (`frontend/`)
```powershell
cd frontend
npm run dev       # Vite dev server on http://localhost:5173, proxies /api and /uploads to localhost:5000
npm run build     # tsc type-check, then vite build -> frontend/dist
npm run preview   # preview the production build
```
- No lint or test scripts are configured.
- `frontend/dist` is committed to the repository (not gitignored) — when changing frontend code, rebuild and include the updated `dist/` output in the commit if the change is meant to ship.

## Architecture

### Backend: Clean Architecture, 4 projects (`backend/PAKN.sln`)

- `src/Core/PAKN.Domain` — entities (`Entities/`) and enums (`Enums/AllEnums.cs`). No dependencies on other layers.
- `src/Core/PAKN.Application` — DTOs (`DTOs/`), service interfaces (`Interfaces/CommonInterfaces.cs`), and service implementations (`Services/DanhMucService.cs`, `Services/PaknService.cs`) containing business logic. Depends only on Domain.
- `src/Infrastructure/PAKN.Infrastructure` — `Persistence/ApplicationDbContext.cs` (EF Core + SQL Server, all entity configuration lives in `OnModelCreating`), `Persistence/DbInitializer.cs` (seed data), and `Services/CommonServices.cs` (captcha, local file storage). Implements the Application-layer interfaces.
- `src/Presentation/PAKN.WebAPI` — ASP.NET Core Web API. `Program.cs` wires up DI, DB init/seeding, CORS (allows `localhost:5173`/`localhost:3000` for the frontend), Swagger, and static file serving of `/uploads`. Controllers in `Controllers/`:
  - `CommonControllers.cs`: `DanhMucController` (province/ward/unit/field-topic lookups + admin CRUD for units/fields/topics), `CaptchaController`, `UploadController`.
  - `BusinessControllers.cs`: `PAKNController` (public submit/track/rate a petition), `AdminController` (admin workflow: receive → assign to unit → draft reply → approve reply).

All controllers use `[Route("api/[controller]")]`, so frontend calls go through `/api/...`.

### Domain model

Central entity is `PAKN` (a petition), linked to:
- `NguoiGui` (submitter — person/business/org, with address via `TinhThanh`/`PhuongXa`)
- `DonVi` (receiving unit — self-referencing tree via `DonViChaId`)
- `ChuDePAKN` → `LinhVucPAKN` (topic → field, many-to-one)
- `PAKN_File` (attachments, also linkable to a `PAKN_TraLoi` reply)
- `PAKN_PhanCong` (assignment to a unit)
- `PAKN_LichSuTrangThai` (status history log)
- `PAKN_TraLoi` (official reply, requires approval)
- `PAKN_DanhGia` (citizen satisfaction rating, one-to-one with PAKN)

Status workflow (`TrangThaiPAKN` enum, mirrored in `frontend/src/types/index.ts`): `MoiTiepNhan` (new) → `DaTiepNhan` (received) → `DangXuLy` (processing) → `ChoBoSung` (needs more info) → `DaCoKetQua` (has result) → `HoanThanh` (answered) / `TuChoi` (rejected).

**When changing status/domain enums or field names, update both sides**: `backend/src/Core/PAKN.Domain/Enums/AllEnums.cs` (and DTOs) and `frontend/src/types/index.ts` must stay in sync — there is no shared/generated type layer between them.

### Frontend (`frontend/src/`)

- `api/api.ts` — single Axios client (`baseURL: '/api'`); all HTTP calls are grouped into `danhmucApi` (lookups + admin CRUD for units/fields/topics) and `paknApi` (submit/track/rate + admin workflow), mirroring the backend controllers. Add new backend endpoints here rather than calling Axios ad hoc from components.
- `types/index.ts` — all shared TypeScript types/enums, hand-kept in sync with the backend (see above).
- `pages/` — one component per route, wired up in `App.tsx` with `react-router-dom`: `HomePage` (`/`), `SubmitPaknPage` (`/gui-pakn`), `TrackingPage` (`/tra-cuu`), `PublicSearchPage` (`/cong-khai`), `AdminDashboardPage` (`/admin`), `AdminDanhMucPage` (`/admin/danhmuc`).
- `components/` — shared UI: `Navbar`, `PaknSidebar`, `AddressSelector` (province/ward cascading select).
- UI library is Ant Design (`antd`), themed in `App.tsx` (primary color, Vietnamese locale `vi_VN`), plus SweetAlert2 for alerts (`utils/swalAlert.ts`).

### Naming convention

Both backend and frontend code use Vietnamese names for domain-specific identifiers (entities, DTOs, enum members, API routes, component/page names) — e.g. `PAKN`, `DonVi`, `TrangThai`, `tra-cuu`, `cong-khai`. Follow this existing convention for new domain code rather than translating to English.
