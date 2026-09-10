import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Tag,
  Descriptions,
  Timeline,
  Rate,
  Divider,
  message,
  Alert,
  Space,
  List,
  Row,
  Col
} from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  StarOutlined
} from '@ant-design/icons';
import { paknApi } from '../api/api';
import { PaknChiTiet, PaknCongKhaiItem, TrangThaiLabels, TrangThaiPAKN } from '../types';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export const TrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [paknList, setPaknList] = useState<PaknChiTiet[]>([]);
  const [paknData, setPaknData] = useState<PaknChiTiet | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [publicItems, setPublicItems] = useState<PaknCongKhaiItem[]>([]);
  const [loadingPublicItems, setLoadingPublicItems] = useState(false);

  const [currentQuery, setCurrentQuery] = useState<{ maPAKN: string; nguoiGui: string }>({
    maPAKN: '',
    nguoiGui: ''
  });

  const searchByMaPAKN = async (maPAKN: string) => {
    setLoading(true);
    setPaknData(null);
    setPaknList([]);

    try {
      const res = await paknApi.traCuuChiTiet(maPAKN, '');
      if (res.success && res.data?.length > 0) {
        setPaknList(res.data);
        setPaknData(res.data[0]);
        setCurrentQuery({ maPAKN, nguoiGui: '' });
      } else {
        message.error('Không tìm thấy hồ sơ!');
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Không thể tải chi tiết hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPublicItems = async () => {
      setLoadingPublicItems(true);
      try {
        const res = await paknApi.getCongKhai(undefined, 1, 50);
        if (res.success) {
          setPublicItems(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPublicItems(false);
      }
    };

    loadPublicItems();

    const maPAKN = searchParams.get('maPAKN');
    if (maPAKN) {
      const navigationState = location.state as {
        paknData?: PaknChiTiet;
        paknList?: PaknChiTiet[];
      } | null;

      if (navigationState?.paknData?.maPAKN === maPAKN) {
        setPaknData(navigationState.paknData);
        setPaknList(navigationState.paknList || []);
        setCurrentQuery({ maPAKN, nguoiGui: '' });
      } else {
        searchByMaPAKN(maPAKN);
      }
    } else {
      setPaknData(null);
      setPaknList([]);
      setCurrentQuery({ maPAKN: '', nguoiGui: '' });
    }
  }, [location.state, searchParams]);

  const newlyAnsweredItems = publicItems
    .filter(item => item.ngayTraLoi)
    .sort((first, second) => dayjs(second.ngayTraLoi).valueOf() - dayjs(first.ngayTraLoi).valueOf())
    .slice(0, 5);

  const mostRatedItems = publicItems
    .filter(item => typeof item.soLuotDanhGia === 'number')
    .sort((first, second) => (second.soLuotDanhGia || 0) - (first.soLuotDanhGia || 0))
    .slice(0, 5);

  const openPublicDetail = (item: PaknCongKhaiItem) => {
    navigate(`/tra-cuu?maPAKN=${encodeURIComponent(item.maPAKN)}`);
  };

  const onSearch = async (values: { maTraCuu: string }) => {
    const query = values.maTraCuu.trim();
    if (!query) {
      message.warning('Vui lòng nhập Mã PAKN hoặc Tên người gửi!');
      return;
    }

    setLoading(true);
    setPaknData(null);
    setPaknList([]);

    try {
      let maPAKN = '';
      let nguoiGui = '';

      // Phân biệt: bắt đầu bằng "PAKN-" → mã PAKN, còn lại → tên người gửi
      if (query.toUpperCase().startsWith('PAKN-')) {
        maPAKN = query.toUpperCase();
        navigate(`/tra-cuu?maPAKN=${encodeURIComponent(maPAKN)}`);
      } else {
        nguoiGui = query;
      }

      const res = await paknApi.traCuuChiTiet(maPAKN, nguoiGui);

      if (res.success && res.data && res.data.length > 0) {
        setPaknList(res.data);

        // Tra bằng mã PAKN thì hiện chi tiết; tra bằng tên luôn hiển thị danh sách.
        if (maPAKN && res.data.length === 1) {
          setPaknData(res.data[0]);
          setCurrentQuery({
            maPAKN: res.data[0].maPAKN || maPAKN,
            nguoiGui: nguoiGui,
          });
        }
      } else {
        message.error('Không tìm thấy hồ sơ!');
      }
    } catch (err: any) {
      setPaknList([]);
      setPaknData(null);
      message.error(err.response?.data?.message || 'Không tìm thấy hồ sơ!');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPakn = (item: PaknChiTiet) => {
    navigate(`/tra-cuu?maPAKN=${encodeURIComponent(item.maPAKN)}`, {
      state: { paknData: item, paknList },
    });
    setPaknData(item);
    setCurrentQuery({
      maPAKN: item.maPAKN,
      nguoiGui: currentQuery.nguoiGui,
    });
  };

  const handleSubmitRating = async () => {
    if (!paknData) return;
    setSubmittingRating(true);
    try {
      await paknApi.danhGia(currentQuery.maPAKN, currentQuery.nguoiGui, rating, feedback);
      message.success('Cảm ơn bạn đã gửi đánh giá mức độ hài lòng!');

      // Refresh lại dữ liệu
      const res = await paknApi.traCuuChiTiet(currentQuery.maPAKN, currentQuery.nguoiGui);
      if (res.success && res.data?.length > 0) {
        const updated = res.data.find(x => x.maPAKN === paknData.maPAKN) || res.data[0];
        setPaknData(updated);
        setPaknList(res.data);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '30px auto', padding: '0 16px' }}>
      <Card style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <Title level={2} style={{ color: '#1e3a8a', marginBottom: 8 }}>
            Tra cứu kết quả trả lời
          </Title>
        </div>

        <Form layout="vertical" onFinish={onSearch}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Form.Item
              name="maTraCuu"
              rules={[{ required: true, message: 'Vui lòng nhập Mã PAKN hoặc Tên người gửi!' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                placeholder="Nhập mã PAKN hoặc Tên người gửi"
                size="large"
                allowClear
                prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              size="large"
              loading={loading}
              style={{ height: 40, fontWeight: 600 }}
            >
              Tìm kiếm
            </Button>
          </div>
        </Form>
      </Card>

      {/* Danh sách kết quả (khi có nhiều hơn 1) */}
      {paknList.length > 0 && !paknData && (
        <Card
          title={`Tìm thấy ${paknList.length} kết quả`}
          style={{ borderRadius: 12, marginBottom: 24 }}
        >
          <List
            itemLayout="horizontal"
            dataSource={paknList}
            pagination={{ pageSize: 5 }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => handleSelectPakn(item)}>
                    Xem chi tiết
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text>
                        {item.nguoiGui?.hoTen || item.nguoiGui?.tenDoanhNghiep || item.nguoiGui?.tenToChuc || 'Chưa cập nhật'} - {dayjs(item.ngayGui).format('HH:mm DD/MM/YYYY')}
                      </Text>
                      <Tag color={TrangThaiLabels[item.trangThai]?.color || 'default'}>
                        {TrangThaiLabels[item.trangThai]?.label}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <div><strong>{item.tieuDe}</strong></div>
                      <Text type="secondary">
                        {item.noiDung.length > 100 ? item.noiDung.substring(0, 100) + '...' : item.noiDung}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Kết quả chi tiết */}
      {paknData && (
        <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {paknList.length > 1 && (
            <Button
              type="link"
              onClick={() => setPaknData(null)}
              style={{ marginBottom: 12, paddingLeft: 0 }}
            >
              ← Quay lại danh sách ({paknList.length} kết quả)
            </Button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div>
              <Title level={3} style={{ margin: 0, color: '#1e3a8a' }}>Kiến nghị về việc: {paknData.tieuDe}</Title>
              <Text type="secondary">
                {paknData.nguoiGui?.hoTen || paknData.nguoiGui?.tenDoanhNghiep || paknData.nguoiGui?.tenToChuc} - {dayjs(paknData.ngayGui).format('HH:mm ngày DD/MM/YYYY')}
              </Text>
            </div>
          </div>

          {/* <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Đơn vị tiếp nhận">{paknData.tenDonViTiepNhan}</Descriptions.Item>
            <Descriptions.Item label="Lĩnh vực / Chủ đề">{paknData.tenChuDe || 'Chưa phân loại'}</Descriptions.Item>
            <Descriptions.Item label="Hạn giải quyết (SLA)">
              {paknData.hanXuLy ? (
                <span style={{ color: '#d97706', fontWeight: 600 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  {dayjs(paknData.hanXuLy).format('DD/MM/YYYY')}
                </span>
              ) : 'Đang xác định'}
            </Descriptions.Item>
            <Descriptions.Item label="Người gửi">
              {paknData.nguoiGui?.hoTen || paknData.nguoiGui?.tenDoanhNghiep || paknData.nguoiGui?.tenToChuc}
            </Descriptions.Item>
          </Descriptions> */}

          <Card type="inner" title="Nội dung kiến nghị:" style={{ marginBottom: 24 }}>
            <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 15 }}>{paknData.noiDung}</Paragraph>

            {paknData.files && paknData.files.length > 0 && (
              <div>
                <Divider style={{ margin: '12px 0' }} />
                <Text strong>Tài liệu đính kèm:</Text>
                <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {paknData.files.map((f, i) => (
                    <Button key={i} size="small" icon={<DownloadOutlined />} href={f.duongDan} target="_blank">
                      {f.tenFile}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Tiến độ xử lý */}
          {/* <Card type="inner" title="Lịch sử quá trình xử lý" style={{ marginBottom: 24 }}>
            <Timeline
              items={(paknData.lichSu || []).map(l => ({
                color: 'blue',
                children: (
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {TrangThaiLabels[l.trangThaiMoi]?.label || 'Đổi trạng thái'}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>
                      {dayjs(l.createdAt).format('DD/MM/YYYY HH:mm')} - {l.ghiChu}
                    </div>
                  </div>
                )
              }))}
            />
          </Card> */}

          {/* Kết quả trả lời */}
          {paknData.traLoi && paknData.traLoi.length > 0 && (
            <Card
              type="inner"
              title={<span style={{ color: '#16a34a' }}>Cơ quan chức năng trả lời:</span>}
              style={{ marginBottom: 24, borderColor: '#86efac', background: '#f0fdf4' }}
            >
              {paknData.traLoi.map((t, idx) => (
                <div key={idx}>
                  {t.soCongVanTraLoi && (
                    <div style={{ fontWeight: 600, marginBottom: 8, color: '#15803d' }}>
                      <FilePdfOutlined style={{ marginRight: 6 }} /> Văn bản trả lời: {t.soCongVanTraLoi}
                    </div>
                  )}
                  <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 15 }}>{t.noiDungTraLoi}</Paragraph>
                  {t.filesDinhKem && t.filesDinhKem.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Text strong>File công văn chính thức (.PDF):</Text>
                      <div style={{ marginTop: 8 }}>
                        {t.filesDinhKem.map((f, i) => (
                          <Button key={i} type="primary" size="small" icon={<DownloadOutlined />} href={f.duongDan} target="_blank">
                            Tải công văn: {f.tenFile}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}

          {/* Đánh giá mức độ hài lòng */}
          {paknData.trangThai === TrangThaiPAKN.HoanThanh && (
            <Card type="inner" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
              {paknData.danhGia ? (
                <Alert
                  type="success"
                  showIcon
                  message="Bạn đã gửi đánh giá cho phản ánh này"
                  description={
                    <div>
                      <div>Mức độ: <Rate disabled defaultValue={paknData.danhGia.mucDoHaiLong} /></div>
                      {paknData.danhGia.noiDungGopY && <div>Ý kiến: "{paknData.danhGia.noiDungGopY}"</div>}
                    </div>
                  }
                />
              ) : (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Bạn cảm thấy mức độ giải quyết thế nào?</Text>
                    <div style={{ marginTop: 6 }}>
                      <Rate value={rating} onChange={setRating} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Ý kiến đóng góp:</Text>
                    <TextArea
                      rows={3}
                      placeholder="Nhập ý kiến đánh giá"
                      value={feedback}
                      onChange={e => setFeedback(e.target.value)}
                      style={{ marginTop: 6 }}
                    />
                  </div>
                  <Button
                    type="primary"
                    loading={submittingRating}
                    onClick={handleSubmitRating}
                    style={{ background: '#d97706', borderColor: '#d97706' }}
                  >
                    Đánh giá
                  </Button>
                </div>
              )}
            </Card>
          )}
        </Card>
      )}

      {!paknData && (
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card
              title="Kiến nghị mới trả lời"
              loading={loadingPublicItems}
              style={{ borderRadius: 12, height: '100%' }}
            >
              {newlyAnsweredItems.map(item => (
                <div
                  onClick={() => openPublicDetail(item)}
                  style={{
                    marginBottom: 12,
                    cursor: 'pointer',
                  }}
                >
                  {item.tieuDe}
                </div>
              ))}
            </Card>
          </Col>

          <Col span={24}>
            <Card
              title="Kiến nghị nhiều đánh giá"
              loading={loadingPublicItems}
              style={{ borderRadius: 12, height: '100%' }}
            >
              {mostRatedItems.map(item => (
                <div
                  onClick={() => openPublicDetail(item)}
                  style={{
                    marginBottom: 12,
                    cursor: 'pointer',
                  }}
                >
                  {item.tieuDe}
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};