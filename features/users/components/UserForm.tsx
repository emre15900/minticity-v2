'use client';

import { useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
import { FiAtSign, FiGlobe, FiPhone, FiUser, FiUsers } from 'react-icons/fi';
import { UserAvatarUpload } from '@/features/users/components/UserAvatarUpload';
import { UserFormValues } from '@/features/users/types/user';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, 'En az 3 karakter').required('Ad soyad gerekli'),
  username: Yup.string()
    .min(3, 'En az 3 karakter')
    .required('Kullanıcı adı gerekli'),
  email: Yup.string().email('Geçerli e-posta girin').required('E-posta gerekli'),
  phone: Yup.string().min(7, 'Geçerli telefon girin').required('Telefon gerekli'),
  companyName: Yup.string().required('Şirket adı gerekli'),
  website: Yup.string().url('Geçerli URL girin').notRequired(),
  avatarUrl: Yup.string().notRequired(),
});

type UserFormProps = {
  initialValues: UserFormValues;
  submitting?: boolean;
  submitText?: string;
  footer?: React.ReactNode;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onDirtyChange?: (dirty: boolean) => void;
};

function DirtyWatcher({
  dirty,
  onDirtyChange,
}: {
  dirty: boolean;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  return null;
}

export function UserForm({
  initialValues,
  submitting,
  submitText = 'Kaydet',
  footer,
  onSubmit,
  onDirtyChange,
}: UserFormProps) {
  return (
    <Card className="card-like">
      <Formik<UserFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          isSubmitting,
          dirty,
          setFieldValue,
        }) => {
          return (
            <Form layout="vertical" onFinish={handleSubmit as any}>
              <DirtyWatcher dirty={dirty} onDirtyChange={onDirtyChange} />
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Avatar">
                    <UserAvatarUpload
                      value={values.avatarUrl}
                      onChange={(dataUrl) =>
                        setFieldValue('avatarUrl', dataUrl ?? '')
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Ad Soyad"
                    validateStatus={touched.name && errors.name ? 'error' : ''}
                    help={touched.name && errors.name ? errors.name : undefined}
                  >
                    <Input
                      name="name"
                      prefix={<FiUser />}
                      placeholder="Jane Doe"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Kullanıcı Adı"
                    validateStatus={
                      touched.username && errors.username ? 'error' : ''
                    }
                    help={
                      touched.username && errors.username
                        ? errors.username
                        : undefined
                    }
                  >
                    <Input
                      name="username"
                      prefix={<FiUsers />}
                      placeholder="janedoe"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="E-posta"
                    validateStatus={touched.email && errors.email ? 'error' : ''}
                    help={
                      touched.email && errors.email ? errors.email : undefined
                    }
                  >
                    <Input
                      name="email"
                      type="email"
                      prefix={<FiAtSign />}
                      placeholder="ornek@mail.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Telefon"
                    validateStatus={touched.phone && errors.phone ? 'error' : ''}
                    help={
                      touched.phone && errors.phone ? errors.phone : undefined
                    }
                  >
                    <Input
                      name="phone"
                      prefix={<FiPhone />}
                      placeholder="+90 555 555 55 55"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Web Sitesi"
                    validateStatus={
                      touched.website && errors.website ? 'error' : ''
                    }
                    help={
                      touched.website && errors.website
                        ? errors.website
                        : undefined
                    }
                  >
                    <Input
                      name="website"
                      prefix={<FiGlobe />}
                      placeholder="minticity.com"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Şirket"
                    validateStatus={
                      touched.companyName && errors.companyName ? 'error' : ''
                    }
                    help={
                      touched.companyName && errors.companyName
                        ? errors.companyName
                        : undefined
                    }
                  >
                    <Input
                      name="companyName"
                      prefix={<FiUsers />}
                      placeholder="Şirket adı"
                      value={values.companyName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Space className="w-full justify-between" align="center">
                {footer}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting || isSubmitting}
                >
                  {submitText}
                </Button>
              </Space>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}

