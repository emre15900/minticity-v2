'use client';

import { useEffect } from 'react';
import {
  BankOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { UserFormValues } from '@/lib/types/users';

type UserFormProps = {
  initialValues?: UserFormValues;
  submitting?: boolean;
  submitText?: string;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  footer?: React.ReactNode;
};

export function UserForm({
  initialValues,
  submitting,
  submitText = 'Kaydet',
  onSubmit,
  footer,
}: UserFormProps) {
  const [form] = Form.useForm<UserFormValues>();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  return (
    <Card>
      <Form<UserFormValues>
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Ad Soyad"
              name="name"
              rules={[{ required: true, message: 'Lütfen ad soyad girin' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ör: Jane Doe" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Kullanıcı Adı"
              name="username"
              rules={[{ required: true, message: 'Kullanıcı adı zorunlu' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Ör: janedoe" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="E-posta"
              name="email"
              rules={[
                { required: true, message: 'E-posta gerekli' },
                { type: 'email', message: 'Geçerli bir e-posta girin' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="ornek@mail.com"
                type="email"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Telefon"
              name="phone"
              rules={[{ required: true, message: 'Telefon zorunlu' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="+90 555 555 55 55" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Web Sitesi" name="website">
              <Input prefix={<GlobalOutlined />} placeholder="minticity.com" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Şirket"
              name="companyName"
              rules={[{ required: true, message: 'Şirket adı gerekli' }]}
            >
              <Input prefix={<BankOutlined />} placeholder="Şirket adı" />
            </Form.Item>
          </Col>
        </Row>

        <Space className="w-full justify-between" align="center">
          {footer}
          <Button type="primary" htmlType="submit" loading={submitting}>
            {submitText}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}

