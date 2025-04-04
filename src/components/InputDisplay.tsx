import React from 'react';
import { useTranslation } from 'react-i18next';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import * as S from './PhoneItem.styles';
import styled from 'styled-components';

interface InputDisplayItemsProps {
    title?: string;

}

export const InputDisplay: React.FC<InputDisplayItemsProps> = ({ title }) => {
    const { t } = useTranslation();

    return (

        <BaseButtonsForm.Item
            name="email"
            $successText={t('profile.nav.personalInfo.verified')}
            label={title}

        >  <HoverableDiv>
                <S.InputDisplay disabled={true} className="ant-input" /></HoverableDiv >
        </BaseButtonsForm.Item>
    );
}; const HoverableDiv = styled.div`
  transition: all 0.3s ease;
  transform: scale(1);
  box-shadow: none;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(3, 139, 148, 0.3);
  }
`;
