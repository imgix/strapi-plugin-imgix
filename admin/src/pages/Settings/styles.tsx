import styled from 'styled-components';

import { Link } from '@strapi/design-system/v2';

export const HeaderLink = styled(Link)`
    span {
        font-size: 1rem;
    }
`;

export const HintLink = styled(Link)`
    gap: 4px;
    
    span {
        font-size: .75rem;
    }

    svg {
        width: .75rem;
        height: .75rem;
    }
`;