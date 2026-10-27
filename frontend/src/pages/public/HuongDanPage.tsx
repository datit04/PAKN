import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Menu, Typography, Steps, Alert, Divider, Tag } from 'antd';
import {
  ReadOutlined,
  UserAddOutlined,
  FormOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  ProfileOutlined,
  EditOutlined,
  PaperClipOutlined,
  SafetyOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

type HuongDanSection = 'thuc-hien' | 'dang-ky' | 'gui-pakn' | 'hoi-dap' | 'tai-lieu';

const MENU_ITEMS: { key: HuongDanSection; label: string }[] = [
  { key: 'thuc-hien', label: 'Hướng dẫn thực hiện Phản ánh, kiến nghị' },
  { key: 'dang-ky', label: 'Đăng ký' },
  { key: 'gui-pakn', label: 'Gửi phản ánh, kiến nghị' },
  { key: 'hoi-dap', label: 'Hỏi đáp' },
  { key: 'tai-lieu', label: 'Tài liệu hướng dẫn' },
];

const SectionPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    <Title level={3} style={{ color: '#1e3a8a', marginBottom: 16 }}>{title}</Title>
    <Alert
      type="info"
      showIcon
      message="Nội dung đang được cập nhật"
      description="Phần hướng dẫn này sẽ sớm được bổ sung. Vui lòng quay lại sau."
    />
  </Card>
);

const GuiPaknGuide: React.FC = () => (
  <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    <Title level={3} style={{ color: '#1e3a8a', marginBottom: 8 }}>Hướng dẫn gửi phản ánh, kiến nghị</Title>
    <Alert
      type="warning"
      showIcon
      style={{ marginBottom: 24 }}
      message="Phạm vi tiếp nhận"
      description={
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Hệ thống chỉ tiếp nhận phản ánh, kiến nghị về: hành vi chậm trễ, gây phiền hà hoặc thực hiện không đúng quy định trong giải quyết thủ tục hành chính; cơ chế, chính sách, thủ tục hành chính không phù hợp thực tế; các giải pháp, sáng kiến liên quan đến hoạt động sản xuất, kinh doanh và đời sống người dân.</li>
          <li>Hệ thống <Text strong>không tiếp nhận</Text> đơn thư khiếu nại, tố cáo và không thực hiện hướng dẫn, giải đáp pháp luật.</li>
        </ul>
      }
    />

    <Steps
      direction="vertical"
      items={[
        {
          icon: <UserOutlined />,
          title: 'Bước 1: Chọn đối tượng phản ánh, kiến nghị',
          description: (
            <Paragraph style={{ marginBottom: 0 }}>
              Truy cập mục <Text strong>"Gửi PAKN"</Text> trên thanh menu, sau đó chọn một trong 4 đối tượng: <Tag>Người dân</Tag><Tag>Doanh nghiệp</Tag><Tag>Tổ chức</Tag><Tag>Cơ quan nhà nước</Tag>. Biểu mẫu sẽ tự động hiển thị các trường thông tin phù hợp với đối tượng đã chọn.
            </Paragraph>
          )
        },
        {
          icon: <ProfileOutlined />,
          title: 'Bước 2: Nhập thông tin người gửi',
          description: (
            <div>
              <Paragraph style={{ marginBottom: 8 }}>Điền đầy đủ, chính xác các thông tin sau để cơ quan chức năng có thể liên hệ khi cần:</Paragraph>
              <ul style={{ marginTop: 0, paddingLeft: 18 }}>
                <li>Họ và tên (đối với người dân) hoặc tên doanh nghiệp/tổ chức; riêng cơ quan nhà nước cần chọn Bộ/Địa phương, đơn vị trực thuộc và người đại diện gửi.</li>
                <li>Địa chỉ theo Tỉnh/Thành phố và Phường/Xã (không áp dụng với cơ quan nhà nước).</li>
                <li>Số điện thoại liên hệ (bắt buộc, 9–11 chữ số) và địa chỉ email (không bắt buộc).</li>
              </ul>
            </div>
          )
        },
        {
          icon: <EditOutlined />,
          title: 'Bước 3: Nhập nội dung phản ánh, kiến nghị',
          description: (
            <div>
              <ul style={{ marginTop: 0, paddingLeft: 18 }}>
                <li>Chọn <Text strong>Lĩnh vực/Chủ đề</Text> phù hợp với nội dung kiến nghị.</li>
                <li>Chọn <Text strong>Cơ quan/Đơn vị tiếp nhận</Text> phụ trách xử lý.</li>
                <li>Nhập <Text strong>Tiêu đề</Text> ngắn gọn, phản ánh đúng nội dung.</li>
                <li>Nhập <Text strong>Nội dung chi tiết</Text> đầy đủ, rõ ràng, trung thực.</li>
              </ul>
              <Alert
                type="error"
                showIcon
                message="Lưu ý: Nội dung phản ánh có thể được công khai. Không ghi thông tin cá nhân nhạy cảm (số CCCD, số tài khoản ngân hàng...) trong phần nội dung."
              />
            </div>
          )
        },
        {
          icon: <PaperClipOutlined />,
          title: 'Bước 4: Đính kèm tài liệu (nếu có)',
          description: (
            <Paragraph style={{ marginBottom: 0 }}>
              Bấm <Text strong>"Chọn file"</Text> để tải lên hình ảnh, văn bản hoặc tài liệu minh chứng liên quan (có thể chọn nhiều file). Đây là bước không bắt buộc nhưng giúp cơ quan tiếp nhận xử lý nhanh và chính xác hơn.
            </Paragraph>
          )
        },
        {
          icon: <SafetyOutlined />,
          title: 'Bước 5: Nhập mã bảo mật (captcha)',
          description: (
            <Paragraph style={{ marginBottom: 0 }}>
              Nhập chính xác các ký tự hiển thị trong ảnh vào ô mã bảo mật. Nếu không đọc rõ, bấm <Text strong>"Đổi mã"</Text> để lấy mã mới.
            </Paragraph>
          )
        },
        {
          icon: <SendOutlined />,
          title: 'Bước 6: Gửi phản ánh và lưu mã tra cứu',
          description: (
            <Paragraph style={{ marginBottom: 0 }}>
              Kiểm tra lại toàn bộ thông tin rồi bấm nút <Text strong>"Gửi phản ánh"</Text>. Sau khi gửi thành công, hệ thống sẽ cấp một <Text strong>mã PAKN</Text> (dạng PAKN-XXXX-XXXXXX) — hãy lưu lại mã này để tra cứu tiến độ và kết quả xử lý tại mục <Text strong>"Tra cứu"</Text>.
            </Paragraph>
          )
        }
      ]}
    />

    <Divider />

    <Alert
      type="success"
      showIcon
      message="Sau khi gửi phản ánh"
      description="Bạn có thể vào mục “Tra cứu” và nhập mã PAKN (hoặc tên đã đăng ký) để theo dõi trạng thái xử lý. Khi kiến nghị được trả lời (trạng thái “Hoàn thành”), bạn có thể đánh giá mức độ hài lòng về kết quả giải quyết ngay trên trang tra cứu."
    />
  </Card>
);

export const HuongDanPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();
  const activeSection: HuongDanSection = (MENU_ITEMS.find(m => m.key === section)?.key) || 'gui-pakn';

  useEffect(() => {
    if (!section) {
      navigate(`/huong-dan/${activeSection}`, { replace: true });
    }
  }, [section, activeSection, navigate]);

  const renderContent = () => {
    switch (activeSection) {
      case 'gui-pakn':
        return <GuiPaknGuide />;
      case 'thuc-hien':
        return <SectionPlaceholder title="Hướng dẫn thực hiện Phản ánh, kiến nghị" />;
      case 'dang-ky':
        return <SectionPlaceholder title="Đăng ký" />;
      case 'hoi-dap':
        return <SectionPlaceholder title="Hỏi đáp" />;
      case 'tai-lieu':
        return <SectionPlaceholder title="Tài liệu hướng dẫn" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 1180, margin: '30px auto', padding: '0 16px' }}>
      <Card style={{ borderRadius: 12, marginBottom: 24, padding: 0 }} styles={{ body: { padding: 0 } }}>
        <Menu
          mode="horizontal"
          selectedKeys={[activeSection]}
          items={MENU_ITEMS.map(item => ({ key: item.key, label: item.label }))}
          onClick={({ key }) => navigate(`/huong-dan/${key}`)}
          style={{ borderBottom: 'none', borderRadius: 12, justifyContent: 'center' }}
        />
      </Card>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {renderContent()}
      </div>
    </div>
  );
};
