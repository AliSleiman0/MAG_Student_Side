import React from 'react';
import * as S from './References.styles';
import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';

export const References: React.FC = () => {
    return (
        <S.ReferencesWrapper>
            <S.Text>
                Made by{' '}
                <a href="https://github.com/AliSleiman0" target="_blank" rel="noreferrer">
                    Ali{' '}
                </a>
                &{' '}
                <a href="https://github.com/Doaa2024" target="_blank" rel="noreferrer">
                    Doaa{' '}
                </a>
                in 2025 &copy;. Based on{' '}
                <a href="https://ant.design/" target="_blank" rel="noreferrer">
                    Ant-design.
                </a>
            </S.Text>
            <S.Icons>
                <a href="https://github.com/AliSleiman0" target="_blank" rel="noreferrer">
                    <GithubOutlined />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <TwitterOutlined />
                </a>
                <a href="https://www.facebook.come" target="_blank" rel="noreferrer">
                    <FacebookOutlined />
                </a>
                <a href="https://linkedin.com/in/AliSleiman11" target="_blank" rel="noreferrer">
                    <LinkedinOutlined />
                </a>
            </S.Icons>
        </S.ReferencesWrapper>
    );
};
