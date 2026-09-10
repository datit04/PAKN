import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Tag, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Typography, 
  Radio, 
  Upload 
} from 'antd';
import { 
  CheckOutlined, 
  UserSwitchOutlined, 
  FormOutlined, 
  FileDoneOutlined, 
  UploadOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { paknApi, danhmucApi } from '../api/api';
import { PaknChiTiet, TrangThaiLabels, TrangThaiPAKN, DonVi, FileAttachment } from '../types';
import { showErrorToast, showSuccessToast } from '../utils/swalAlert';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<PaknChiTiet[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTrangThai, setFilterTrangThai] = useState<number | undefined>(undefined);
  const [donViList, setDonViList] = useState<DonVi[]>([]);

  // Modals
  const [selectedPakn, setSelectedPakn] = useState<PaknChiTiet | null>(null);
  const [isPhanCongOpen, setIsPhanCongOpen] = useState(false);
  const [isSoanTraLoiOpen, setIsSoanTraLoiOpen] = useState(false);

  const [formPhanCong] = Form.useForm();
  const [formSoanTraLoi] = Form.useForm();
  const [uploadedAnswerFiles, setUploadedAnswerFiles] = useState<FileAttachment[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paknApi.adminGetAll(filterTrangThai);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    danhmucApi.getDonViTiepNhan().then(setDonViList).catch(console.error);
  }, [filterTrangThai]);

  const handleTiepNhan = async (record: PaknChiTiet) => {
    try {
      const res = await paknApi.adminTiepNhan(record.id);
      if (res.success) {
        showSuccessToast(`Đã tiếp nhận hồ sơ`);
        fetchData();
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi tiếp nhận');
    }
  };

  const handlePhanCongSubmit = async (values: any) => {
    if (!selectedPakn) return;
    try {
      const res = await paknApi.adminPhanCong(selectedPakn.id, values.donViId, values.noiDungGiaoViec);
      if (res.success) {
        showSuccessToast('Phân công xử lý thành công!');
        setIsPhanCongOpen(false);
        formPhanCong.resetFields();
        fetchData();
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi phân công');
    }
  };

  const handleSoanTraLoiSubmit = async (values: any) => {
    if (!selectedPakn) return;
    try {
      const res = await paknApi.adminSoanTraLoi(
        selectedPakn.id,
        values.soCongVanTraLoi,
        values.noiDungTraLoi,
        uploadedAnswerFiles
      );
      if (res.success) {
        showSuccessToast('Đã lưu bản thảo câu trả lời, gửi lãnh đạo duyệt!');
        setIsSoanTraLoiOpen(false);
        formSoanTraLoi.resetFields();
        setUploadedAnswerFiles([]);
        fetchData();
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi lưu câu trả lời');
    }
  };

  const handleDuyetTraLoi = async (record: PaknChiTiet) => {
    // Với demo, duyệt trực tiếp câu trả lời mới nhất
    try {
      const res = await paknApi.adminDuyetTraLoi(record.id, 0, true);
      if (res.success) {
        showSuccessToast(`Đã duyệt câu trả lời`);
        fetchData();
      }
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi duyệt');
    }
  };

  const handleUploadAnswerFile = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await danhmucApi.uploadFile(file as File);
      setUploadedAnswerFiles(prev => [...prev, res]);
      onSuccess(res);
      showSuccessToast(`Tải lên văn bản công văn: ${file.name}`);
    } catch (err) {
      onError(err);
      showErrorToast('Lỗi tải file');
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: PaknChiTiet, index: number) => index + 1
    },
    {
      title: 'Tiêu đề & Nội dung',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 300,
      render: (tieuDe: string, record: PaknChiTiet) => (
        <div>
          <div
            title={tieuDe}
            style={{
              fontWeight: 600,
              lineHeight: '1.4',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              wordBreak: 'break-word'
            }}
          >
            {tieuDe}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            Người gửi: {record.nguoiGui.hoTen || record.nguoiGui.tenDoanhNghiep || record.nguoiGui.tenToChuc} 
          </div>
        </div>
      )
    },
    {
      title: 'Đơn vị tiếp nhận',
      dataIndex: 'tenDonViTiepNhan',
      key: 'tenDonViTiepNhan'
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'ngayGui',
      key: 'ngayGui',
      render: (date: string) => dayjs(date).format('HH:mm - DD/MM/YYYY')
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: TrangThaiPAKN) => (
        <Tag color={TrangThaiLabels[status]?.color || 'default'}>
          {TrangThaiLabels[status]?.label || 'Chưa rõ'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: PaknChiTiet) => (
        <Space size="small" wrap>
          {record.trangThai === TrangThaiPAKN.MoiTiepNhan && (
            <Button size="small" type="primary" onClick={() => handleTiepNhan(record)}>
              Tiếp nhận
            </Button>
          )}

          {record.trangThai === TrangThaiPAKN.DaTiepNhan && (
            <Button size="small" onClick={() => { setSelectedPakn(record); setIsPhanCongOpen(true); }}>
              Phân công
            </Button>
          )}

          {record.trangThai === TrangThaiPAKN.DangXuLy && (
            <Button size="small" onClick={() => { setSelectedPakn(record); setIsSoanTraLoiOpen(true); }}>
              Soạn trả lời
            </Button>
          )}

          {record.trangThai === TrangThaiPAKN.DaCoKetQua && (
            <Button size="small" type="primary" style={{ background: '#16a34a', borderColor: '#16a34a' }} onClick={() => handleDuyetTraLoi(record)}>
              Duyệt
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '30px auto', padding: '0 16px' }}>
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>Bàn Làm Việc Cán Bộ Thụ Lý</Title>
          </div>
          <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Radio.Group value={filterTrangThai} onChange={e => setFilterTrangThai(e.target.value)}>
            <Radio.Button value={undefined}>Tất cả</Radio.Button>
            <Radio.Button value={TrangThaiPAKN.MoiTiepNhan}>Mới tiếp nhận</Radio.Button>
            <Radio.Button value={TrangThaiPAKN.DaTiepNhan}>Đã tiếp nhận</Radio.Button>
            <Radio.Button value={TrangThaiPAKN.DangXuLy}>Đang xử lý</Radio.Button>
            <Radio.Button value={TrangThaiPAKN.DaCoKetQua}>Chờ duyệt kết quả</Radio.Button>
            <Radio.Button value={TrangThaiPAKN.HoanThanh}>Đã trả lời</Radio.Button>
          </Radio.Group>
        </div>

        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Modal Phân Công */}
      <Modal
        title={`Phân công xử lý`}
        open={isPhanCongOpen}
        onCancel={() => setIsPhanCongOpen(false)}
        onOk={() => formPhanCong.submit()}
      >
        <Form form={formPhanCong} layout="vertical" onFinish={handlePhanCongSubmit}>
          <Form.Item name="donViId" label="Phòng ban / Đơn vị thụ lý chính" rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}>
            <Select 
              placeholder="Chọn cơ quan/đơn vị thụ lý"
              options={donViList.map(d => ({ value: d.id, label: d.tenDonVi }))}
            />
          </Form.Item>
          <Form.Item name="noiDungGiaoViec" label="Ý kiến giao việc / Chỉ đạo" rules={[{ required: true, message: 'Vui lòng nhập nội dung chỉ đạo!' }]}>
            <TextArea rows={3} placeholder="Nhập nội dung chỉ đạo" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Soạn Trả Lời */}
      <Modal
        title={`Soạn văn bản trả lời`}
        open={isSoanTraLoiOpen}
        onCancel={() => setIsSoanTraLoiOpen(false)}
        onOk={() => formSoanTraLoi.submit()}
        width={700}
      >
        <Form form={formSoanTraLoi} layout="vertical" onFinish={handleSoanTraLoiSubmit}>
          <Form.Item name="soCongVanTraLoi" label="Số hiệu công văn / văn bản trả lời" >
            <Input placeholder="Nhập công văn / văn bản" />
          </Form.Item>
          <Form.Item name="noiDungTraLoi" label="Nội dung giải quyết kiến nghị" rules={[{ required: true, message: 'Vui lòng nhập nội dung trả lời!' }]}>
            <TextArea rows={6} placeholder="Nhập nội dung trả lời" />
          </Form.Item>
          <Form.Item label="Đính kèm file">
            <Upload customRequest={handleUploadAnswerFile} maxCount={1}>
              <Button icon={<UploadOutlined />}>Tải file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
