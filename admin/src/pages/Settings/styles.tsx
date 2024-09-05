import styled from 'styled-components';

import { Link } from '@strapi/design-system';

import { ToBeFixed } from '../../../../@types';

export const HeaderLink: ToBeFixed = styled(Link)`
    gap: 6px;

    span {
        font-size: 1.6rem;
    }
`;

export const HintLink: ToBeFixed = styled(Link)`
    gap: 4px;
    
    span {
        font-size: 1.33rem;
    }

    svg {
        width: 1.33rem;
        height: 1.33rem;
    }
`;