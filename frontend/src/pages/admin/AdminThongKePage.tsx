import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { paknApi } from '../../api/api';
import { TrangThaiPAKN, ThongKeAdmin } from '../../types';
import { StatusPieChart } from '../../components/admin/StatusPieChart';

const { Title, Text } = Typography;

export const AdminThongKePage: React.FC = () => {
  const [thongKe, setThongKe] = useState<ThongKeAdmin | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchThongKe = async () => {
    setLoading(true);
    try {
      const res = await paknApi.adminGetThongKe();
      if (res.success) {
        setThongKe(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThongKe();
  }, []);

  const soLuongTheoTrangThai = (trangThai: TrangThaiPAKN) =>
    thongKe?.theoTrangThai.find(x => x.trangThai === trangThai)?.soLuong || 0;

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 16px' }}>
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>Thống Kê Tổng Quan</Title>
          <Button icon={<ReloadOutlined />} onClick={fetchThongKe}>Làm mới</Button>
        </div>

        <Card size="small" loading={loading} style={{ marginBottom: 20 }}>
          <StatusPieChart
            data={[
              { key: 'moi', label: 'Mới tiếp nhận', value: soLuongTheoTrangThai(TrangThaiPAKN.MoiTiepNhan), color: '#2563eb' },
              { key: 'datiepnhan', label: 'Đã tiếp nhận', value: soLuongTheoTrangThai(TrangThaiPAKN.DaTiepNhan), color: '#9333ea' },
              { key: 'dangxuly', label: 'Đang xử lý', value: soLuongTheoTrangThai(TrangThaiPAKN.DangXuLy), color: '#d97706' },
              { key: 'datraloi', label: 'Đã trả lời', value: soLuongTheoTrangThai(TrangThaiPAKN.HoanThanh), color: '#16a34a' },
              { key: 'quahan', label: 'Quá hạn', value: thongKe?.quaHan || 0, color: '#dc2626' },
            ]}
          />
        </Card>

        {/* <Card
          size="small"
          title="Top 5 đơn vị đang xử lý nhiều hồ sơ nhất"
          loading={loading}
        >
          {thongKe?.topDonViDangXuLy.length ? (
            <List
              size="small"
              dataSource={thongKe.topDonViDangXuLy}
              renderItem={(item, index) => (
                <List.Item>
                  <Text>{index + 1}. {item.tenDonVi}</Text>
                  <Tag color="warning">{item.soLuong} hồ sơ</Tag>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">Chưa có đơn vị nào đang xử lý hồ sơ.</Text>
          )}
        </Card> */}
      </Card>
    </div>
  );
};
