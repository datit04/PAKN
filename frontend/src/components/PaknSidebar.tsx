import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Divider, Input, Space, Typography } from 'antd';
import {
  CheckOutlined,
  ClockCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { paknApi, danhmucApi } from '../api/api';
import { LuuYItem } from '../types';

const { Text } = Typography;

export const PaknSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [statistics, setStatistics] = useState({ daTraLoi: 0, dangXuLy: 0 });
  const [luuYList, setLuuYList] = useState<LuuYItem[]>([]);

  const handleSearch = () => {
    const searchKeyword = keyword.trim();
    navigate(searchKeyword ? `/cong-khai?keyword=${encodeURIComponent(searchKeyword)}` : '/cong-khai');
  };

  useEffect(() => {
    paknApi.getThongKe()
      .then(res => {
        if (res.success) {
          setStatistics(res.data);
        }
      })
      .catch(console.error);

    danhmucApi.getLuuY()
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setLuuYList(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card
        title="Lưu ý"
        size="small"
        style={{ borderRadius: 4, borderColor: '#d9d9d9' }}
        headStyle={{ background: '#e5e7eb', fontSize: 18, color: '#1f2937' }}
      >
        {luuYList.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 0, color: '#334155', lineHeight: 1.65, listStyleType: 'none' }}>
            {luuYList.map((item, index) => (
              <li key={item.id} style={{ marginBottom: index < luuYList.length - 1 ? 12 : 0 }}>
                <strong>{item.noiDung}</strong>
                {item.children && item.children.length > 0 && (
                  <ul style={{ paddingLeft: 18, marginTop: 6, listStyleType: 'disc' }}>
                    {item.children.map(child => (
                      <li key={child.id} style={{ marginBottom: 4 }}>
                        {child.noiDung}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 0, color: '#334155', lineHeight: 1.65, listStyleType: 'none' }}>
            <li style={{ marginBottom: 12 }}>
              <strong>1. Hệ thống tiếp nhận các phản ánh, kiến nghị về:</strong>
              <ul style={{ paddingLeft: 18, marginTop: 6, listStyleType: 'disc' }}>
                <li>Hành vi chậm trễ, gây phiền hà hoặc không thực hiện, thực hiện không đúng quy định trong giải quyết thủ tục hành chính;</li>
                <li>Cơ chế, chính sách, thủ tục hành chính không phù hợp với thực tế, không đồng bộ, không thống nhất hoặc không hợp pháp;</li>
                <li>Giải pháp, sáng kiến liên quan đến hoạt động sản xuất, kinh doanh và đời sống của người dân;</li>
                <li>Các trường hợp thực hiện không đúng Nghị quyết 68/NQ-CP và Quyết định 23/2021/QĐ-TTg.</li>
              </ul>
            </li>
            <li><strong>2. Hệ thống không tiếp nhận đơn thư khiếu nại, tố cáo và hướng dẫn giải đáp pháp luật.</strong></li>
          </ul>
        )}
      </Card>

      <Card
        title="Tra cứu thông tin PAKN"
        size="small"
        style={{ borderRadius: 4, borderColor: '#d9d9d9' }}
        headStyle={{ background: '#e5e7eb', fontSize: 16, color: '#1f2937' }}
      >
        <Input
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          onPressEnter={handleSearch}
          placeholder="Nhập mã số PAKN / tên người gửi"
          suffix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        />
        <Button type="primary" block icon={<SearchOutlined />} onClick={handleSearch} style={{ marginTop: 10 }}>
          Tìm kiếm
        </Button>
      </Card>

      <Card
        title="Tình hình xử lý PAKN"
        size="small"
        style={{ borderRadius: 4, borderColor: '#d9d9d9' }}
        headStyle={{ background: '#e5e7eb', fontSize: 16, color: '#1f2937' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>PAKN đã trả lời</Text>
          <Space><CheckOutlined style={{ color: '#7c964c' }} /><Text strong style={{ color: '#7c964c', fontSize: 20 }}>{statistics.daTraLoi.toLocaleString('vi-VN')}</Text></Space>
        </div>
        <Divider style={{ margin: '12px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text>PAKN đang xử lý</Text>
          <Space><ClockCircleOutlined style={{ color: '#f2a634' }} /><Text strong style={{ color: '#f2a634', fontSize: 20 }}>{statistics.dangXuLy.toLocaleString('vi-VN')}</Text></Space>
        </div>
      </Card>
    </Space>
  );
};
