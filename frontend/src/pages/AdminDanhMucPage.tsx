import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  Typography,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  AppstoreOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { danhmucApi } from '../api/api';
import { DonVi, LinhVuc, ChuDe } from '../types';
import { showErrorToast, showSuccessToast } from '../utils/swalAlert';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const AdminDanhMucPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  // Đơn vị
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [isDonViModalOpen, setIsDonViModalOpen] = useState(false);
  const [editingDonVi, setEditingDonVi] = useState<DonVi | null>(null);
  const [formDonVi] = Form.useForm();

  // Lĩnh vực & Chủ đề
  const [linhVucList, setLinhVucList] = useState<LinhVuc[]>([]);
  const [isLinhVucModalOpen, setIsLinhVucModalOpen] = useState(false);
  const [editingLinhVuc, setEditingLinhVuc] = useState<LinhVuc | null>(null);
  const [formLinhVuc] = Form.useForm();

  const [isChuDeModalOpen, setIsChuDeModalOpen] = useState(false);
  const [editingChuDe, setEditingChuDe] = useState<{ chuDe: ChuDe; linhVucId: number } | null>(null);
  const [formChuDe] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [dv, lv] = await Promise.all([
        danhmucApi.getDonViTiepNhan(),
        danhmucApi.getLinhVucVaChuDe()
      ]);
      setDonViList(dv);
      setLinhVucList(lv);
    } catch (err) {
      showErrorToast('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= QUẢN LÝ ĐƠN VỊ =================
  const handleOpenDonViModal = (record?: DonVi) => {
    if (record) {
      setEditingDonVi(record);
      formDonVi.setFieldsValue(record);
    } else {
      setEditingDonVi(null);
      formDonVi.resetFields();
      formDonVi.setFieldsValue({ loaiDonVi: 1 });
    }
    setIsDonViModalOpen(true);
  };

  const handleSaveDonVi = async (values: any) => {
    try {
      if (editingDonVi) {
        await danhmucApi.updateDonVi(editingDonVi.id, values);
        showSuccessToast('Cập nhật cơ quan/đơn vị thành công!');
      } else {
        await danhmucApi.createDonVi(values);
        showSuccessToast('Thêm cơ quan/đơn vị thành công!');
      }
      setIsDonViModalOpen(false);
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi thao tác đơn vị');
    }
  };

  const handleDeleteDonVi = async (id: number) => {
    try {
      await danhmucApi.deleteDonVi(id);
      showSuccessToast('Xóa đơn vị thành công!');
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi khi xóa đơn vị');
    }
  };

  // ================= QUẢN LÝ LĨNH VỰC =================
  const handleOpenLinhVucModal = (record?: LinhVuc) => {
    if (record) {
      setEditingLinhVuc(record);
      formLinhVuc.setFieldsValue(record);
    } else {
      setEditingLinhVuc(null);
      formLinhVuc.resetFields();
    }
    setIsLinhVucModalOpen(true);
  };

  const handleSaveLinhVuc = async (values: any) => {
    try {
      if (editingLinhVuc) {
        await danhmucApi.updateLinhVuc(editingLinhVuc.id, values);
        showSuccessToast('Cập nhật lĩnh vực thành công!');
      } else {
        await danhmucApi.createLinhVuc(values);
        showSuccessToast('Thêm lĩnh vực thành công!');
      }
      setIsLinhVucModalOpen(false);
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi thao tác lĩnh vực');
    }
  };

  const handleDeleteLinhVuc = async (id: number) => {
    try {
      await danhmucApi.deleteLinhVuc(id);
      showSuccessToast('Xóa lĩnh vực thành công!');
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi khi xóa lĩnh vực');
    }
  };

  // ================= QUẢN LÝ CHỦ ĐỀ =================
  const handleOpenChuDeModal = (linhVucId: number, record?: ChuDe) => {
    if (record) {
      setEditingChuDe({ chuDe: record, linhVucId });
      formChuDe.setFieldsValue({ ...record, linhVucId });
    } else {
      setEditingChuDe(null);
      formChuDe.resetFields();
      formChuDe.setFieldsValue({ linhVucId, thoiGianXuLyMacDinhNgay: 15 });
    }
    setIsChuDeModalOpen(true);
  };

  const handleSaveChuDe = async (values: any) => {
    try {
      if (editingChuDe) {
        await danhmucApi.updateChuDe(editingChuDe.chuDe.id, values);
        showSuccessToast('Cập nhật chủ đề thành công!');
      } else {
        await danhmucApi.createChuDe(values);
        showSuccessToast('Thêm chủ đề thành công!');
      }
      setIsChuDeModalOpen(false);
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi thao tác chủ đề');
    }
  };

  const handleDeleteChuDe = async (id: number) => {
    try {
      await danhmucApi.deleteChuDe(id);
      showSuccessToast('Xóa chủ đề thành công!');
      loadData();
    } catch (err: any) {
      showErrorToast(err.response?.data?.message || 'Lỗi khi xóa chủ đề');
    }
  };

  const donViColumns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: DonVi, index: number) => index + 1
    },
    { title: 'Tên cơ quan / đơn vị', dataIndex: 'tenDonVi', key: 'tenDonVi' },
    {
      title: 'Đơn vị cấp trên',
      dataIndex: 'donViChaId',
      key: 'donViChaId',
      render: (chaId?: number) => {
        if (!chaId) return <Tag color="blue">Cơ quan chủ trì (Cấp 1)</Tag>;
        const cha = donViList.find(d => d.id === chaId);
        return <Tag color="cyan">{cha?.tenDonVi || `ID: ${chaId}`}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 160,
      render: (_: any, record: DonVi) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" onClick={() => handleOpenDonViModal(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa đơn vị này?" onConfirm={() => handleDeleteDonVi(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const linhVucColumns = [
    {
      title: 'STT',
      key: 'stt',
      width: 70,
      align: 'center' as const,
      render: (_: unknown, __: LinhVuc, index: number) => index + 1
    },
    { title: 'Tên lĩnh vực phản ánh', dataIndex: 'tenLinhVuc', key: 'tenLinhVuc', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Số lượng chủ đề', key: 'count', render: (_: any, record: LinhVuc) => <Tag color="purple">{record.danhSachChuDe?.length || 0} chủ đề</Tag> },
    {
      title: 'Thao tác',
      key: 'action',
      width: 260,
      render: (_: any, record: LinhVuc) => (
        <Space size="small">
          <Button icon={<PlusOutlined />} size="small" type="primary" onClick={() => handleOpenChuDeModal(record.id)}>
            Thêm chủ đề
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleOpenLinhVucModal(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa lĩnh vực này?" onConfirm={() => handleDeleteLinhVuc(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '30px auto', padding: '0 16px' }}>
      <Card style={{ borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1e3a8a' }}>Quản Trị Danh Mục Hệ Thống</Title>
          </div>
          <Button icon={<ReloadOutlined />} onClick={loadData}>Làm mới</Button>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: '1',
              label: <span><BankOutlined /> Cơ quan & Đơn vị</span>,
              children: (
                <div>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenDonViModal()}>
                      Thêm cơ quan / đơn vị
                    </Button>
                  </div>
                  <Table
                    columns={donViColumns}
                    dataSource={donViList}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 8 }}
                  />
                </div>
              )
            },
            {
              key: '2',
              label: <span><AppstoreOutlined /> Lĩnh vực & Chủ đề kiến nghị</span>,
              children: (
                <div>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenLinhVucModal()}>
                      Thêm lĩnh vực mới
                    </Button>
                  </div>
                  <Table
                    columns={linhVucColumns}
                    dataSource={linhVucList}
                    rowKey="id"
                    loading={loading}
                    expandable={{
                      expandedRowRender: (record: LinhVuc) => (
                        <Table
                          size="small"
                          pagination={false}
                          columns={[
                            { title: 'Chủ đề chi tiết', dataIndex: 'tenChuDe', key: 'tenChuDe' },
                            {
                              title: 'Thời hạn xử lý (SLA)',
                              dataIndex: 'thoiGianXuLyMacDinhNgay',
                              key: 'thoiGianXuLyMacDinhNgay',
                              render: (val: number) => <Tag color="orange">{val} ngày làm việc</Tag>
                            },
                            {
                              title: 'Thao tác',
                              key: 'subAction',
                              width: 120,
                              render: (_: any, c: ChuDe) => (
                                <Space size="small">
                                  <Button icon={<EditOutlined />} size="small" onClick={() => handleOpenChuDeModal(record.id, c)} />
                                  <Popconfirm title="Xóa chủ đề này?" onConfirm={() => handleDeleteChuDe(c.id)}>
                                    <Button icon={<DeleteOutlined />} size="small" danger />
                                  </Popconfirm>
                                </Space>
                              )
                            }
                          ]}
                          dataSource={record.danhSachChuDe}
                          rowKey="id"
                        />
                      )
                    }}
                    pagination={{ pageSize: 6 }}
                  />
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Modal Thêm/Sửa Đơn vị */}
      <Modal
        title={editingDonVi ? "Chỉnh sửa cơ quan / đơn vị" : "Thêm cơ quan / đơn vị mới"}
        open={isDonViModalOpen}
        onCancel={() => setIsDonViModalOpen(false)}
        onOk={() => formDonVi.submit()}
      >
        <Form form={formDonVi} layout="vertical" onFinish={handleSaveDonVi}>
          <Form.Item name="maDonVi" label="Mã đơn vị" rules={[{ required: true, message: 'Nhập mã đơn vị!' }]}>
            <Input placeholder="Ví dụ: STNMT-HN, SXD-HCM..." style={{ textTransform: 'uppercase' }} />
          </Form.Item>
          <Form.Item name="tenDonVi" label="Tên cơ quan / đơn vị" rules={[{ required: true, message: 'Nhập tên đơn vị!' }]}>
            <Input placeholder="Ví dụ: Sở Tài nguyên và Môi trường" />
          </Form.Item>
          <Form.Item name="donViChaId" label="Đơn vị cấp trên (Nếu là phòng ban/đơn vị trực thuộc)">
            <Select
              allowClear
              placeholder="Chọn cơ quan cấp trên (để trống nếu là cấp 1)"
              options={donViList.filter(d => !editingDonVi || d.id !== editingDonVi.id).map(d => ({ value: d.id, label: d.tenDonVi }))}
            />
          </Form.Item>
          <Form.Item name="soDienThoai" label="Số điện thoại / Hotline tiếp nhận">
            <Input placeholder="Ví dụ: 024.3825.xxxx" />
          </Form.Item>
          <Form.Item name="email" label="Email tiếp nhận">
            <Input placeholder="Ví dụ: stnmt@hanoi.gov.vn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm/Sửa Lĩnh vực */}
      <Modal
        title={editingLinhVuc ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
        open={isLinhVucModalOpen}
        onCancel={() => setIsLinhVucModalOpen(false)}
        onOk={() => formLinhVuc.submit()}
      >
        <Form form={formLinhVuc} layout="vertical" onFinish={handleSaveLinhVuc}>
          <Form.Item name="tenLinhVuc" label="Tên lĩnh vực" rules={[{ required: true, message: 'Nhập tên lĩnh vực!' }]}>
            <Input placeholder="Ví dụ: Tài nguyên và Môi trường, Giao thông vận tải..." />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả phạm vi">
            <TextArea rows={3} placeholder="Mô tả các vấn đề thuộc lĩnh vực này tiếp nhận..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Thêm/Sửa Chủ đề */}
      <Modal
        title={editingChuDe ? "Chỉnh sửa chủ đề PAKN" : "Thêm chủ đề PAKN mới"}
        open={isChuDeModalOpen}
        onCancel={() => setIsChuDeModalOpen(false)}
        onOk={() => formChuDe.submit()}
      >
        <Form form={formChuDe} layout="vertical" onFinish={handleSaveChuDe}>
          <Form.Item name="linhVucId" label="Thuộc lĩnh vực" rules={[{ required: true }]}>
            <Select
              disabled={true}
              options={linhVucList.map(l => ({ value: l.id, label: l.tenLinhVuc }))}
            />
          </Form.Item>
          <Form.Item name="tenChuDe" label="Tên chủ đề phản ánh" rules={[{ required: true, message: 'Nhập tên chủ đề!' }]}>
            <Input placeholder="Ví dụ: Xả rác thải bừa bãi, Ùn tắc giao thông..." />
          </Form.Item>
          <Form.Item
            name="thoiGianXuLyMacDinhNgay"
            label="Thời hạn giải quyết mặc định theo luật định (Số ngày SLA)"
            rules={[{ required: true, message: 'Nhập số ngày giải quyết!' }]}
          >
            <InputNumber min={1} max={60} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
