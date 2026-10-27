import axios from 'axios';
import {
  TinhThanh,
  PhuongXa,
  DonVi,
  LinhVuc,
  CreatePaknPayload,
  PaknChiTiet,
  PaknCongKhaiItem,
  FileAttachment,
  TrangThaiPAKN,
  ThongKeAdmin
} from '../types';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const danhmucApi = {
  getTinhThanh: async (): Promise<TinhThanh[]> => {
    const res = await apiClient.get('/danhmuc/tinh-thanh');
    return res.data;
  },

  getPhuongXa: async (tinhThanhId: number, keyword?: string): Promise<PhuongXa[]> => {
    const res = await apiClient.get('/danhmuc/phuong-xa', {
      params: { tinhThanhId, keyword }
    });
    return res.data;
  },

  getDonViTiepNhan: async (loaiDonVi?: number): Promise<DonVi[]> => {
    const res = await apiClient.get('/danhmuc/don-vi-tiep-nhan', {
      params: { loaiDonVi }
    });
    return res.data;
  },

  getLinhVucVaChuDe: async (): Promise<LinhVuc[]> => {
    const res = await apiClient.get('/danhmuc/linh-vuc-chu-de');
    return res.data;
  },

  getCaptcha: async (): Promise<{ captchaId: string; image: string }> => {
    const res = await apiClient.get('/captcha');
    return res.data;
  },

  uploadFile: async (file: File): Promise<FileAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // CRUD Đơn vị
  createDonVi: async (data: any) => {
    const res = await apiClient.post('/danhmuc/don-vi', data);
    return res.data;
  },
  updateDonVi: async (id: number, data: any) => {
    const res = await apiClient.put(`/danhmuc/don-vi/${id}`, data);
    return res.data;
  },
  deleteDonVi: async (id: number) => {
    const res = await apiClient.delete(`/danhmuc/don-vi/${id}`);
    return res.data;
  },

  // CRUD Lĩnh vực
  createLinhVuc: async (data: any) => {
    const res = await apiClient.post('/danhmuc/linh-vuc', data);
    return res.data;
  },
  updateLinhVuc: async (id: number, data: any) => {
    const res = await apiClient.put(`/danhmuc/linh-vuc/${id}`, data);
    return res.data;
  },
  deleteLinhVuc: async (id: number) => {
    const res = await apiClient.delete(`/danhmuc/linh-vuc/${id}`);
    return res.data;
  },

  // CRUD Chủ đề
  createChuDe: async (data: any) => {
    const res = await apiClient.post('/danhmuc/chu-de', data);
    return res.data;
  },
  updateChuDe: async (id: number, data: any) => {
    const res = await apiClient.put(`/danhmuc/chu-de/${id}`, data);
    return res.data;
  },
  deleteChuDe: async (id: number) => {
    const res = await apiClient.delete(`/danhmuc/chu-de/${id}`);
    return res.data;
  }
};

export const paknApi = {
  createPakn: async (payload: CreatePaknPayload): Promise<{ success: boolean; data: { maPAKN: string; maBiMat: string; ngayGui: string; message: string } }> => {
    const res = await apiClient.post('/pakn', payload);
    return res.data;
  },

  deletePakn: async (id: number) => {
    const res = await apiClient.delete(`/pakn/${id}`);
    return res.data;
  },

  traCuuChiTiet: async (maPAKN: string, nguoiGui: string): Promise<{ success: boolean; data: PaknChiTiet[] }> => {
    const payload: { maPAKN?: string; nguoiGui?: string } = {};

    if (maPAKN.trim()) {
      payload.maPAKN = maPAKN.trim();
    }
    if (nguoiGui.trim()) {
      payload.nguoiGui = nguoiGui.trim();
    }

    const res = await apiClient.post('/pakn/tra-cuu', payload);
    return res.data;
  },
  getCongKhai: async (keyword?: string, page = 1, pageSize = 10): Promise<{ success: boolean; data: PaknCongKhaiItem[] }> => {
    const res = await apiClient.get('/pakn/cong-khai', {
      params: { keyword, page, pageSize }
    });
    return res.data;
  },

  getThongKe: async (): Promise<{ success: boolean; data: { daTraLoi: number; dangXuLy: number } }> => {
    const [daTraLoiRes, dangXuLyRes] = await Promise.all([
      apiClient.get('/admin/danh-sach', { params: { trangThai: TrangThaiPAKN.HoanThanh } }),
      apiClient.get('/admin/danh-sach', { params: { trangThai: TrangThaiPAKN.DangXuLy } })
    ]);

    return {
      success: Boolean(daTraLoiRes.data?.success && dangXuLyRes.data?.success),
      data: {
        daTraLoi: daTraLoiRes.data?.data?.length || 0,
        dangXuLy: dangXuLyRes.data?.data?.length || 0
      }
    };
  },

  danhGia: async (maPAKN: string, maBiMat: string, mucDoHaiLong: number, noiDungGopY?: string) => {
    const res = await apiClient.post('/pakn/danh-gia', {
      maPAKN,
      maBiMat,
      mucDoHaiLong,
      noiDungGopY
    });
    return res.data;
  },

  // Admin APIs
  adminGetAll: async (trangThai?: number) => {
    const res = await apiClient.get('/admin/danh-sach', { params: { trangThai } });
    return res.data;
  },

  adminGetThongKe: async (): Promise<{ success: boolean; data: ThongKeAdmin }> => {
    const res = await apiClient.get('/admin/thong-ke');
    return res.data;
  },

  adminTiepNhan: async (id: number) => {
    const res = await apiClient.post(`/admin/${id}/tiep-nhan`);
    return res.data;
  },

  adminPhanCong: async (id: number, donViId: number, noiDungGiaoViec: string) => {
    const res = await apiClient.post(`/admin/${id}/phan-cong`, { donViId, noiDungGiaoViec });
    return res.data;
  },

  adminSoanTraLoi: async (id: number, soCongVanTraLoi: string, noiDungTraLoi: string, filesDinhKem: FileAttachment[]) => {
    const res = await apiClient.post(`/admin/${id}/soan-tra-loi`, {
      soCongVanTraLoi,
      noiDungTraLoi,
      filesDinhKem
    });
    return res.data;
  },

  adminDuyetTraLoi: async (id: number, traLoiId: number, isApprove: boolean, ghiChu?: string) => {
    const res = await apiClient.post(`/admin/${id}/duyet-tra-loi`, {
      traLoiId,
      isApprove,
      ghiChu
    });
    return res.data;
  }
};
