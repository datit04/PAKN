export enum DoiTuongPAKN {
  NguoiDan = 1,
  DoanhNghiep = 2,
  ToChuc = 3,
  CoQuanNhaNuoc = 4
}

export enum TrangThaiPAKN {
  MoiTiepNhan = 0,
  DaTiepNhan = 1,
  DangXuLy = 2,
  ChoBoSung = 3,
  DaCoKetQua = 4,
  HoanThanh = 5,
  TuChoi = 6
}

export const TrangThaiLabels: Record<TrangThaiPAKN, { label: string; color: string }> = {
  [TrangThaiPAKN.MoiTiepNhan]: { label: 'Mới tiếp nhận', color: 'default' },
  [TrangThaiPAKN.DaTiepNhan]: { label: 'Đã tiếp nhận', color: 'processing' },
  [TrangThaiPAKN.DangXuLy]: { label: 'Đang xử lý', color: 'warning' },
  [TrangThaiPAKN.ChoBoSung]: { label: 'Chờ bổ sung', color: 'purple' },
  [TrangThaiPAKN.DaCoKetQua]: { label: 'Đã có kết quả', color: 'cyan' },
  [TrangThaiPAKN.HoanThanh]: { label: 'Đã trả lời', color: 'success' },
  [TrangThaiPAKN.TuChoi]: { label: 'Từ chối giải quyết', color: 'error' }
};

export interface TinhThanh {
  id: number;
  maTinh: string;
  tenTinh: string;
}

export interface PhuongXa {
  id: number;
  maPhuongXa: string;
  tenPhuongXa: string;
  tinhThanhId: number;
}

export interface DonVi {
  id: number;
  maDonVi: string;
  tenDonVi: string;
  donViChaId?: number | null;
  loaiDonVi: number;
}

export interface ChuDe {
  id: number;
  tenChuDe: string;
  thoiGianXuLyMacDinhNgay: number;
}

export interface LinhVuc {
  id: number;
  tenLinhVuc: string;
  danhSachChuDe: ChuDe[];
}

export interface FileAttachment {
  tenFile: string;
  duongDan: string;
  dungLuong: number;
  loaiFile: string;
}

export interface NguoiGuiForm {
  hoTen?: string;
  tenDoanhNghiep?: string;
  tenToChuc?: string;
  soDienThoai: string;
  email?: string;
  tinhThanhId?: number;
  phuongXaId?: number;
  diaChiChiTiet?: string;
  boDiaPhuongId?: number;
  donViTrucThuocId?: number;
}

export interface CreatePaknPayload {
  doiTuongPAKN: DoiTuongPAKN;
  nguoiGui: NguoiGuiForm;
  chuDeId?: number | null;
  linhVucId?: number | null;
  tieuDe: string;
  noiDung: string;
  donViTiepNhanId: number;
  isAnDanh: boolean;
  captchaId: string;
  captchaCode: string;
  files: FileAttachment[];
}

export interface PaknChiTiet {
  id: number;
  maPAKN: string;
  doiTuongPAKN: DoiTuongPAKN;
  tieuDe: string;
  noiDung: string;
  trangThai: TrangThaiPAKN;
  ngayGui: string;
  hanXuLy?: string | null;
  tenDonViTiepNhan: string;
  tenChuDe?: string;
  nguoiGui: NguoiGuiForm;
  files: FileAttachment[];
  lichSu: {
    trangThaiCu?: TrangThaiPAKN;
    trangThaiMoi: TrangThaiPAKN;
    ghiChu?: string;
    createdAt: string;
  }[];
  traLoi: {
    soCongVanTraLoi?: string;
    noiDungTraLoi: string;
    ngayDuyet?: string;
    filesDinhKem: FileAttachment[];
  }[];
  danhGia?: {
    mucDoHaiLong: number;
    noiDungGopY?: string;
    ngayDanhGia: string;
  } | null;
}

export interface ThongKeAdmin {
  tongSo: number;
  theoTrangThai: { trangThai: TrangThaiPAKN; soLuong: number }[];
  quaHan: number;
  topDonViDangXuLy: { donViId: number; tenDonVi: string; soLuong: number }[];
}

export interface PaknCongKhaiItem {
  maPAKN: string;
  tieuDe: string;
  noiDung: string;
  tenDonViTiepNhan: string;
  nguoiGuiChe: string;
  trangThai: TrangThaiPAKN;
  ngayGui: string;
  cauTraLoiMoiNhat?: string;
  ngayTraLoi?: string;
  soLuotDanhGia?: number;
}
