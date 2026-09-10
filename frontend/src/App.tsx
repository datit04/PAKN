import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SubmitPaknPage } from './pages/SubmitPaknPage';
import { TrackingPage } from './pages/TrackingPage';
import { PublicSearchPage } from './pages/PublicSearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminDanhMucPage } from './pages/AdminDanhMucPage';

export const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#b91c1c', // Màu đỏ quốc kỳ/cổng dịch vụ công
          borderRadius: 8,
          fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }
      }}
    >
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
          <Navbar />
          <main style={{ flex: 1, paddingBottom: 40 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gui-pakn" element={<SubmitPaknPage />} />
              <Route path="/tra-cuu" element={<TrackingPage />} />
              <Route path="/cong-khai" element={<PublicSearchPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/danhmuc" element={<AdminDanhMucPage />} />
            </Routes>
          </main>
          <footer style={{ background: '#1e293b', color: '#94a3b8', textAlign: 'center', padding: '24px 16px', fontSize: 13 }}>
            <div>© 2026 CỔNG THÔNG TIN TIẾP NHẬN PHẢN ÁNH KIẾN NGHỊ VÀ TRẢ LỜI KIẾN NGHỊ</div>
            <div style={{ marginTop: 4, color: '#64748b' }}>Hệ thống chính quyền địa phương 2 cấp | Phát triển theo mô hình chuyển đổi số quốc gia</div>
          </footer>
        </div>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
