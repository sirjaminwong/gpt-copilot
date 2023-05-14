import React from 'react'

import { CaretRightOutlined } from '@ant-design/icons'
import { StyledContainer, CloseButton, StyledDrawer } from './style'

interface Props {
  top: React.CSSProperties['top'];
  onClose: () => void;
  placement: 'left' | 'right';
  setPlacement: (placement: 'left' | 'right') => void;
}

const SideDrawer = (props: Props) => {
  return (
    <StyledDrawer $zIndex={1000} $top={props.top} placement={props.placement}>
      <CloseButton placement={props.placement} onClick={props.onClose}>
        <CaretRightOutlined style={{ color: '#fff', height: '24px' }} />
      </CloseButton>
      <StyledContainer placement={props.placement}>

      </StyledContainer>
    </StyledDrawer>
  )
}

export default SideDrawer
