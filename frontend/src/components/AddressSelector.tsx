import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Input, Form } from 'antd';
import { danhmucApi } from '../api/api';
import { TinhThanh, PhuongXa } from '../types';

interface AddressSelectorProps {
  tinhThanhName?: string;
  phuongXaName?: string;
  diaChiChiTietName?: string;
  required?: boolean;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  tinhThanhName = ['nguoiGui', 'tinhThanhId'],
  phuongXaName = ['nguoiGui', 'phuongXaId'],
  diaChiChiTietName = ['nguoiGui', 'diaChiChiTiet'],
  required = true,
}) => {
  const [tinhThanhList, setTinhThanhList] = useState<TinhThanh[]>([]);
  const [phuongXaList, setPhuongXaList] = useState<PhuongXa[]>([]);
  const [selectedTinhId, setSelectedTinhId] = useState<number | null>(null);
  const [loadingPhuongXa, setLoadingPhuongXa] = useState(false);

  useEffect(() => {
    danhmucApi.getTinhThanh().then(setTinhThanhList).catch(console.error);
  }, []);

  const handleTinhThanhChange = async (tinhId: number) => {
    setSelectedTinhId(tinhId);
    setLoadingPhuongXa(true);
    try {
      const data = await danhmucApi.getPhuongXa(tinhId);
      setPhuongXaList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPhuongXa(false);
    }
  };

  const handleSearchPhuongXa = async (value: string) => {
    if (!selectedTinhId) return;
    try {
      const data = await danhmucApi.getPhuongXa(selectedTinhId, value);
      setPhuongXaList(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Row gutter={12}>
        <Col xs={24} md={12}>
          <Form.Item
            name={tinhThanhName}
            label="Tỉnh / Thành phố"
            rules={[{ required, message: 'Vui lòng chọn Tỉnh/Thành phố!' }]}
          >
            <Select
              placeholder="Chọn Tỉnh / Thành phố"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={tinhThanhList.map(t => ({ value: t.id, label: t.tenTinh }))}
              onChange={handleTinhThanhChange}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name={phuongXaName}
            label="Phường / Xã"
            rules={[{ required, message: 'Vui lòng chọn Phường/Xã!' }]}
          >
            <Select
              placeholder={selectedTinhId ? "Nhập tên để tìm kiếm Phường/Xã..." : "Chọn Phường/Xã"}
              disabled={!selectedTinhId}
              loading={loadingPhuongXa}
              showSearch
              onSearch={handleSearchPhuongXa}
              filterOption={false}
              options={phuongXaList.map(p => ({ value: p.id, label: p.tenPhuongXa }))}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={diaChiChiTietName}
        label="Địa chỉ chi tiết (Số nhà, tổ/thôn xóm, tên đường...)"
      >
        <Input placeholder="Nhập số nhà, thôn xóm,..." />
      </Form.Item>
    </div>
  );
};
