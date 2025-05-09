import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { notificationController } from '@app/controllers/notificationController';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useUser } from '../../../Context/UserContext';

interface LoginFormData {
    userid: number;
    password: string;
}

export const initValues: Partial<LoginFormData> = {
    userid: 8,
    password: 'password',
};

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { loginUser } = useUser();

    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (values: LoginFormData) => {
        setLoading(true);
        try {
            const loginResponse = await loginUser({ userid: values.userid, password: values.password });
            console.log("loginResponse", loginResponse);
            loginResponse.usertype === "Professor" ? navigate('/Messager') : navigate('/')

        } catch (err: any) {
            notificationController.error({ message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Auth.FormWrapper>
            <BaseForm
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
                initialValues={initValues}
            >
                <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
                <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>

                <Auth.FormItem
                    name="userid"
                    label={t('common.id')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Auth.FormInput
                        type="number"
                        placeholder={t('common.id')}
                    />
                </Auth.FormItem>

                <Auth.FormItem
                    name="password"
                    label={t('common.password')}
                    rules={[{ required: true, message: t('common.requiredField') }]}
                >
                    <Auth.FormInputPassword placeholder={t('common.password')} />
                </Auth.FormItem>

                <Auth.ActionsWrapper>
                    <BaseForm.Item name="rememberMe" valuePropName="checked" noStyle>
                        <Auth.FormCheckbox>
                            <S.RememberMeText>{t('login.rememberMe')}</S.RememberMeText>
                        </Auth.FormCheckbox>
                    </BaseForm.Item>
                    <Link to="/auth/forgot-password">
                        <S.ForgotPasswordText>{t('common.forgotPass')}</S.ForgotPasswordText>
                    </Link>
                </Auth.ActionsWrapper>

                <BaseForm.Item noStyle>
                    <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
                        {t('common.login')}
                    </Auth.SubmitButton>
                </BaseForm.Item>
            </BaseForm>
        </Auth.FormWrapper>
    );
};
