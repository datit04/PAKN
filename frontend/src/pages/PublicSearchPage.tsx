import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Input, List, Tag, Typography, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, CheckCircleOutlined, UserOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { paknApi } from '../api/api';
import { PaknCongKhaiItem, TrangThaiLabels } from '../types';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

export const PublicSearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<PaknCongKhaiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const fetchData = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const res = await paknApi.getCongKhai(searchKeyword);
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialKeyword = searchParams.get('keyword') || '';
    setKeyword(initialKeyword);
    fetchData(initialKeyword);
  }, []);

  const handleSearch = () => {
    fetchData(keyword);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ color: '#1e3a8a', marginBottom: 8 }}>Công Khai Kết Quả Phản Ánh Kiến Nghị</Title>
        <Paragraph type="secondary">
          Minh bạch toàn bộ quá trình tiếp nhận và kết quả giải quyết kiến nghị của các cấp chính quyền.
        </Paragraph>
      </div>

      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row gutter={12}>
          <Col xs={18} sm={20}>
            <Input 
              placeholder="Nhập từ khóa tìm kiếm (Môi trường, giao thông, cấp phép, thủ tục...)" 
              size="large"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={6} sm={4}>
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              size="large" 
              onClick={handleSearch}
              style={{ width: '100%' }}
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Card>

      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={items}
        pagination={{ pageSize: 5 }}
        renderItem={(item) => (
          <Card 
            hoverable 
            style={{ marginBottom: 16, borderRadius: 12, borderColor: '#e5e7eb' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>{item.tieuDe}</Title>
              <Tag color={TrangThaiLabels[item.trangThai]?.color || 'default'}>
                {TrangThaiLabels[item.trangThai]?.label || 'Chưa xác định'}
              </Tag>
            </div>

            <Space direction="horizontal" size="middle" style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }} wrap>
              <span><UserOutlined /> Người gửi: <b>{item.nguoiGuiChe}</b></span>
              <span><BankOutlined /> Đơn vị tiếp nhận: <b>{item.tenDonViTiepNhan}</b></span>
              <span><CalendarOutlined /> Ngày gửi: {dayjs(item.ngayGui).format('DD/MM/YYYY')}</span>
              <span>Mã PAKN: <Text code>{item.maPAKN}</Text></span>
            </Space>

            <Paragraph ellipsis={{ rows: 3 }} style={{ fontSize: 14, color: '#374151' }}>
              {item.noiDung}
            </Paragraph>

            {item.cauTraLoiMoiNhat && (
              <div style={{ background: '#f0fdf4', padding: '12px 16px', borderRadius: 8, borderLeft: '4px solid #16a34a', marginTop: 12 }}>
                <Text strong style={{ color: '#16a34a' }}>
                  <CheckCircleOutlined style={{ marginRight: 6 }} /> Kết quả trả lời của cơ quan thẩm quyền:
                </Text>
                <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '6px 0 0', color: '#166534', fontSize: 14 }}>
                  {item.cauTraLoiMoiNhat}
                </Paragraph>
              </div>
            )}
          </Card>
        )}
      />
    </div>
  );
};
