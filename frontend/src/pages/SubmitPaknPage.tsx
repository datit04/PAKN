import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  Card,
  Row,
  Col,
  Select,
  Upload,
  Checkbox,
  Typography,
  message
} from 'antd';
import {
  UploadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { AddressSelector } from '../components/AddressSelector';
import { PaknSidebar } from '../components/PaknSidebar';
import { danhmucApi, paknApi } from '../api/api';
import { DoiTuongPAKN, DonVi, LinhVuc, FileAttachment } from '../types';
import { showPaknSuccessAlert } from '../utils/swalAlert';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export const SubmitPaknPage: React.FC = () => {
  const [form] = Form.useForm();
  const [doiTuong, setDoiTuong] = useState<DoiTuongPAKN>(DoiTuongPAKN.NguoiDan);
  const [donViList, setDonViList] = useState<DonVi[]>([]);
  const [linhVucList, setLinhVucList] = useState<LinhVuc[]>([]);

  // Captcha state
  const [captchaId, setCaptchaId] = useState('');
  const [captchaImg, setCaptchaImg] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchCaptcha = async () => {
    setLoadingCaptcha(true);
    try {
      const data = await danhmucApi.getCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaImg(data.image);
    } catch (err) {
      message.error('Không thể tải mã bảo mật');
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    danhmucApi.getDonViTiepNhan().then(setDonViList).catch(console.error);
    danhmucApi.getLinhVucVaChuDe().then(setLinhVucList).catch(console.error);
  }, []);

  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const res = await danhmucApi.uploadFile(file as File);
      setUploadedFiles(prev => [...prev, res]);
      onSuccess(res);
      message.success(`Tải lên thành công: ${file.name}`);
    } catch (err) {
      onError(err);
      message.error(`Lỗi tải lên: ${file.name}`);
    }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const payload = {
        doiTuongPAKN: doiTuong,
        nguoiGui: values.nguoiGui,
        chuDeId: values.chuDeId,
        tieuDe: values.tieuDe,
        noiDung: values.noiDung,
        donViTiepNhanId: values.donViTiepNhanId,
        isAnDanh: values.isAnDanh || false,
        captchaId: captchaId,
        captchaCode: values.captchaCode,
        files: uploadedFiles
      };

      const res = await paknApi.createPakn(payload);
      if (res.success) {
        await showPaknSuccessAlert();
        form.resetFields();
        setUploadedFiles([]);
        fetchCaptcha();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Có lỗi xảy ra khi gửi phản ánh!');
      fetchCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1180, margin: '30px auto', padding: '0 16px' }}>
      <Row gutter={[24, 24]} align="top">
        <Col xs={24} md={18} style={{ alignSelf: 'flex-start' }}>
          <Card style={{ width: '100%', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={2} style={{ color: '#b91c1c', marginBottom: 8 }}>Tiếp nhận phản ánh kiến nghị</Title>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ isAnDanh: false }}>
              {/* 1. Chọn Đối tượng PAKN */}
              <Card type="inner" title="1. Đối tượng phản ánh kiến nghị" style={{ marginBottom: 24, background: '#fafafa' }}>
                <Radio.Group
                  value={doiTuong}
                  onChange={e => setDoiTuong(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={12} sm={6}>
                      <Radio.Button value={DoiTuongPAKN.NguoiDan} style={{ width: '100%', textAlign: 'center', height: 42, lineHeight: '40px', whiteSpace: 'nowrap' }}>
                        Người dân
                      </Radio.Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Radio.Button value={DoiTuongPAKN.DoanhNghiep} style={{ width: '100%', textAlign: 'center', height: 42, lineHeight: '40px', whiteSpace: 'nowrap' }}>
                        Doanh nghiệp
                      </Radio.Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Radio.Button value={DoiTuongPAKN.ToChuc} style={{ width: '100%', textAlign: 'center', height: 42, lineHeight: '40px', whiteSpace: 'nowrap' }}>
                        Tổ chức
                      </Radio.Button>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Radio.Button value={DoiTuongPAKN.CoQuanNhaNuoc} style={{ width: '100%', textAlign: 'center', height: 42, lineHeight: '40px', whiteSpace: 'nowrap' }}>
                        Cơ quan nhà nước
                      </Radio.Button>
                    </Col>
                  </Row>
                </Radio.Group>
              </Card>

              {/* 2. Thông tin Người gửi theo Đối tượng */}
              <Card type="inner" title="2. Thông tin người gửi" style={{ marginBottom: 24 }}>
                {doiTuong === DoiTuongPAKN.NguoiDan && (
                  <Form.Item
                    name={['nguoiGui', 'hoTen']}
                    label="Họ và tên người dân"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input placeholder="Nhập tên người dân" />
                  </Form.Item>
                )}

                {doiTuong === DoiTuongPAKN.DoanhNghiep && (
                  <Form.Item
                    name={['nguoiGui', 'tenDoanhNghiep']}
                    label="Tên doanh nghiệp"
                    rules={[{ required: true, message: 'Vui lòng nhập tên doanh nghiệp!' }]}
                  >
                    <Input placeholder="Nhập tên doanh nghiệp" />
                  </Form.Item>
                )}

                {doiTuong === DoiTuongPAKN.ToChuc && (
                  <Form.Item
                    name={['nguoiGui', 'tenToChuc']}
                    label="Tên tổ chức"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức!' }]}
                  >
                    <Input placeholder="Nhập tên tổ chức" />
                  </Form.Item>
                )}

                {doiTuong === DoiTuongPAKN.CoQuanNhaNuoc && (
                  <>
                    <Row gutter={12}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['nguoiGui', 'boDiaPhuongId']}
                          label="Bộ / Địa phương"
                          rules={[{ required: true, message: 'Vui lòng chọn Bộ hoặc Địa phương!' }]}
                        >
                          <Select
                            placeholder="Chọn Bộ / Địa phương"
                            options={donViList.filter(d => !d.donViChaId).map(d => ({ value: d.id, label: d.tenDonVi }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name={['nguoiGui', 'donViTrucThuocId']}
                          label="Đơn vị trực thuộc"
                          rules={[{ required: true, message: 'Vui lòng chọn đơn vị trực thuộc!' }]}
                        >
                          <Select
                            placeholder="Chọn đơn vị trực thuộc"
                            options={donViList.filter(d => d.donViChaId).map(d => ({ value: d.id, label: d.tenDonVi }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name={['nguoiGui', 'hoTen']}
                      label="Người đại diện gửi"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên người gửi!' }]}
                    >
                      <Input placeholder="Họ và tên cán bộ đại diện" />
                    </Form.Item>
                  </>
                )}

                {doiTuong !== DoiTuongPAKN.CoQuanNhaNuoc && (
                  <AddressSelector required={true} />
                )}

                <Row gutter={12}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['nguoiGui', 'soDienThoai']}
                      label="Số điện thoại liên hệ"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]{9,11}$/, message: 'Số điện thoại không hợp lệ (9 - 11 chữ số)!' }
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={['nguoiGui', 'email']}
                      label="Địa chỉ Email"
                      rules={[{ type: 'email', message: 'Email không đúng định dạng!' }]}
                    >
                      <Input placeholder="Nhập email" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              {/* 3. Nội dung Phản ánh */}
              <Card type="inner" title="3. Nội dung phản ánh kiến nghị" style={{ marginBottom: 24 }}>
                <Row gutter={12}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="chuDeId"
                      label="Lĩnh vực / Chủ đề kiến nghị"
                      rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực/chủ đề!' }]}
                    >
                      <Select
                        placeholder="Chọn chủ đề PAKN"
                        options={linhVucList.flatMap(l => {
                          if (!l.danhSachChuDe?.length) {
                            return [{
                              value: l.id,
                              label: `${l.tenLinhVuc}`
                            }];
                          }

                          return l.danhSachChuDe.map(c => ({
                            value: c.id,
                            label: `${l.tenLinhVuc} > ${c.tenChuDe}`
                          }));
                        })}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="donViTiepNhanId"
                      label="Cơ quan / Đơn vị tiếp nhận"
                      rules={[{ required: true, message: 'Vui lòng chọn cơ quan tiếp nhận!' }]}
                    >
                      <Select
                        placeholder="Chọn cơ quan tiếp nhận"
                        options={donViList.map(d => ({ value: d.id, label: d.tenDonVi }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="tieuDe"
                  label="Tiêu đề phản ánh kiến nghị"
                  rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                  <Input placeholder="Nhập tiêu đề PAKN" />
                </Form.Item>

                <Form.Item
                  name="noiDung"
                  label="Nội dung chi tiết"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                  extra="Nội dung này sẽ được công khai. Vui lòng không ghi chi tiết thông tin cá nhân!"
                >
                  <TextArea rows={5} placeholder="Nhập nội dung" />
                </Form.Item>

                {/* Đính kèm file */}
                <Form.Item label="Tài liệu đính kèm">
                  <Upload
                    customRequest={handleCustomUpload}
                    showUploadList={{ showRemoveIcon: true }}
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                  </Upload>
                </Form.Item>
                <Row gutter={16} align="middle">
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="captchaCode"
                      label="Nhập mã bảo mật"
                      rules={[{ required: true, message: 'Vui lòng nhập mã bảo mật!' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="Nhập các ký tự trong hình..." style={{ textTransform: 'uppercase' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
                      {captchaImg && (
                        <img
                          src={captchaImg}
                          alt="CAPTCHA"
                          style={{ height: 42, borderRadius: 6, border: '1px solid #d9d9d9' }}
                        />
                      )}
                      <Button icon={<ReloadOutlined />} onClick={fetchCaptcha} loading={loadingCaptcha}>
                        Đổi mã
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ width: 200, height: 48, fontSize: 16, fontWeight: 'bold', background: '#dc2626', borderColor: '#dc2626' }}
                >
                  Gửi phản ánh
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={6} style={{ alignSelf: 'flex-start' }}>
          <PaknSidebar />
        </Col>
      </Row>

    </div>
  );
};
