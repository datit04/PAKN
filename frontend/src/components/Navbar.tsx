import React from 'react';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  FormOutlined, 
  SearchOutlined, 
  FileSearchOutlined, 
  DashboardOutlined,
  SettingOutlined 
} from '@ant-design/icons';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: '/', label: 'Trang chủ' },
    { key: '/gui-pakn', label: 'Gửi PAKN' },
    { key: '/tra-cuu', label: 'Tra cứu' },
    { key: '/huong-dan', label: 'Hướng dẫn sử dụng' },
    // { key: '/cong-khai', icon: <SearchOutlined />, label: 'Công khai' },
    { key: '/admin', label: 'Xử lý hồ sơ' },
    { key: '/admin/danhmuc', label: 'Quản lý danh mục' },
  ];

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16, color: '#b91c1c' }}>HỆ THỐNG PHẢN HỒI KIẾN NGHỊ</div>
            <div style={{ fontSize: 14, color: '#6b7280' }}>Tiếp nhận, xử lý và trả lời phản ánh, kiến nghị của tổ chức, cá nhân</div>
          </div>
        </div>
        <Menu 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          items={items} 
          onClick={({ key }) => navigate(key)} 
          style={{ borderBottom: 'none', flex: 1, justifyContent: 'flex-end' }}
        />
      </div>
    </header>
  );
};
