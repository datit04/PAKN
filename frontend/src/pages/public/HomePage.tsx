import React from 'react';
import { Card, Row, Col, Button, Typography, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  FormOutlined, 
  SearchOutlined, 
  SafetyCertificateOutlined, 
  CheckCircleOutlined,
  ThunderboltOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 16px' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        borderRadius: 16,
        padding: '48px 32px',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
      }}>
        <Tag color="gold" style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20, marginBottom: 16 }}>
          CHÍNH QUYỀN ĐỊA PHƯƠNG 2 CẤP THÂN THIỆN - PHỤC VỤ
        </Tag>
        <Title level={1} style={{ color: '#fff', marginBottom: 16, fontWeight: 800 }}>
          Hệ Thống Tiếp Nhận & Trả Lời Phản Ánh Kiến Nghị
        </Title>
        <Paragraph style={{ color: '#e0e7ff', fontSize: 16, maxWidth: 800, margin: '0 auto 32px' }}>
          Kênh tương tác trực tuyến thông suốt giữa Người dân, Doanh nghiệp, Tổ chức với các cấp chính quyền. Tiếp nhận 24/7 - Xử lý đúng thời hạn - Công khai minh bạch kết quả.
        </Paragraph>
        <Space size="middle">
          <Button 
            type="primary" 
            size="large" 
            icon={<FormOutlined />} 
            onClick={() => navigate('/gui-pakn')}
            style={{ background: '#dc2626', borderColor: '#dc2626', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600 }}
          >
            Gửi Phản Ánh Kiến Nghị
          </Button>
          <Button 
            size="large" 
            icon={<SearchOutlined />} 
            onClick={() => navigate('/tra-cuu')}
            style={{ height: 48, padding: '0 28px', fontSize: 16 }}
          >
            Tra Cứu Tiến Độ
          </Button>
        </Space>
      </div>

      {/* 4 Đối tượng phục vụ */}
      {/* <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>4 Nhóm Đối Tượng Tiếp Nhận</Title>
      <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: '100%', textAlign: 'center', borderColor: '#e5e7eb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <Title level={4}>Người dân</Title>
            <Paragraph type="secondary">Phản ánh về môi trường, an ninh trật tự, giao thông, thủ tục hành chính cơ sở.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: '100%', textAlign: 'center', borderColor: '#e5e7eb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
            <Title level={4}>Doanh nghiệp</Title>
            <Paragraph type="secondary">Kiến nghị về khó khăn kinh doanh, cấp phép đầu tư, quy định hành chính, thuế phí.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: '100%', textAlign: 'center', borderColor: '#e5e7eb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
            <Title level={4}>Tổ chức</Title>
            <Paragraph type="secondary">Ý kiến đóng góp xây dựng chính sách, quy hoạch và phản ánh vướng mắc cộng đồng.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable style={{ height: '100%', textAlign: 'center', borderColor: '#e5e7eb' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
            <Title level={4}>Cơ quan nhà nước</Title>
            <Paragraph type="secondary">Liên thông ý kiến phối hợp liên ngành giữa các Sở ban ngành và UBND các cấp.</Paragraph>
          </Card>
        </Col>
      </Row> */}

      {/* Cam kết phục vụ */}
      <Card style={{ borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Space align="start">
              <SafetyCertificateOutlined style={{ fontSize: 32, color: '#16a34a' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Bảo Mật Danh Tính</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>Người dân có thể lựa chọn ẩn danh, thông tin cá nhân được bảo vệ theo pháp luật.</div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space align="start">
              <ThunderboltOutlined style={{ fontSize: 32, color: '#eab308' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Xử Lý Đúng Hạn (SLA)</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>Từng loại phản ánh có quy định số ngày giải quyết cụ thể và cảnh báo tự động khi quá hạn.</div>
              </div>
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Space align="start">
              <CheckCircleOutlined style={{ fontSize: 32, color: '#2563eb' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Đo Lường Hài Lòng</div>
                <div style={{ color: '#64748b', fontSize: 14 }}>Được đánh giá chất lượng phục vụ sau khi nhận kết quả giải quyết từ cơ quan thẩm quyền.</div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
