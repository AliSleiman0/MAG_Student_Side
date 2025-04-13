import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseCard } from '@app/components/common/BaseCard/BaseCard';

import { useAppSelector } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import { PaymentCard } from '@app/interfaces/interfaces';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { InputDisplay } from '../../../../../InputDisplay';
import { BaseUpload } from '../../../../../common/BaseUpload/BaseUpload';
import styled from 'styled-components';
import { FONT_SIZE, FONT_WEIGHT } from '../../../../../../styles/themes/constants';
import { InboxOutlined } from '@ant-design/icons';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';




export const PersonalInfo: React.FC = () => {

    const DraggerIconWrapper = styled.div`
  font-size: 4rem;
  color: var(--primary-color);
`;
    const DraggerTitle = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.bold};
`;
    const DraggerDescription = styled.div`
  font-size: ${FONT_SIZE.md};
  padding: 0 1rem;
`;
   
    const user = useAppSelector((state) => state.user.user);

    const [isFieldsChanged, setFieldsChanged] = useState(false);
    const [isLoading, setLoading] = useState(false);

    //usememo for updating
    const [form] = BaseButtonsForm.useForm();

    const { t } = useTranslation();

    const onFinish = useCallback(
        (values: PaymentCard) => {
            // todo dispatch an action here
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setFieldsChanged(false);
                notificationController.success({ message: t('common.success') });
                console.log(values);
            }, 1000);
        },
        [t],
    );
    const uploadProps = {
        name: 'file',

        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange: (info: any) => {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                notificationController.success({ message: t('uploads.successUpload', { name: info.file.name }) });
            } else if (status === 'error') {
                notificationController.error({ message: t('uploads.failedUpload', { name: info.file.name }) });
            }
        },
    };
    return (
        <BaseCard>
            <BaseButtonsForm
                form={form}
                name="info"
                loading={isLoading}
                /*initialValues={userFormValues}*/
                isFieldsChanged={isFieldsChanged}
                setFieldsChanged={setFieldsChanged}
                onFieldsChange={() => setFieldsChanged(true)}
                onFinish={onFinish}
            >
                <BaseRow gutter={{ xs: 10, md: 15, xl: 30 }}>
                    <BaseCol span={24}>
                        <BaseButtonsForm.Item>
                            <BaseButtonsForm.Title>{t('profile.nav.personalInfo.title')}</BaseButtonsForm.Title>
                        </BaseButtonsForm.Item>
                    </BaseCol>

                    <BaseCol xs={24} md={12}>
                        
                            <InputDisplay title="Full Name"  />
                        
                    </BaseCol>
                    <BaseCol xs={24} md={12}>
                         <InputDisplay title="ID" />
                         </BaseCol>
                    <BaseCol xs={24} md={12}>
                      <InputDisplay title="Email" />
                         </BaseCol>

                    <BaseCol xs={24} md={12}>
                          <InputDisplay title="Campus" />
                          </BaseCol>
                    <BaseCol xs={24} md={24} lg={24} style={{ paddingBottom: "30px" }}>
                        <h4 style={{ color: "#038b94" }}>Update Profile Image</h4>
                        <BaseUpload.Dragger {...uploadProps}>
                            <DraggerIconWrapper>
                                <InboxOutlined />
                            </DraggerIconWrapper>
                            <DraggerTitle>{t('uploads.dragUpload')}</DraggerTitle>
                            <DraggerDescription>{t('uploads.bulkUpload')}</DraggerDescription>
                        </BaseUpload.Dragger>
                    </BaseCol>


                </BaseRow>
            </BaseButtonsForm>
        </BaseCard>
    );
};
