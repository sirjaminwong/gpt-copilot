import { Icon } from "@iconify/react"
import React from "react"

import { CloseButton, StyledContainer, StyledDrawer } from "./style"

interface Props {
  top: React.CSSProperties["top"]
  onClose: () => void
  placement: "left" | "right"
  setPlacement: (placement: "left" | "right") => void
}

const SideDrawer = (props: Props) => {
  return (
    <StyledDrawer $zIndex={1000} $top={props.top} placement={props.placement}>
      <CloseButton placement={props.placement} onClick={props.onClose}>
        <Icon icon="ant-design:caret-right-filled" />
      </CloseButton>
      <StyledContainer placement={props.placement}></StyledContainer>
    </StyledDrawer>
  )
}

export default SideDrawer
