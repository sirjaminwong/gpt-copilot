import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import logo from "data-base64:~assets/icon.png"
import React from "react"

const drawIn = keyframes`
  0% {
    width: 0;
  }
  100% {
    width: 408px;
  }
`

export const StyledDrawer = styled.div<{
  placement: "left" | "right"
  $top: React.CSSProperties["top"]
  $zIndex?: number
}>`
  display: flex;
  width: 408px;
  position: fixed;
  top: ${(props) => props.$top};
  z-index: ${(props) => props.$zIndex};
  ${({ placement }) => placement}: 0;
  bottom: 0;
  animation: ${drawIn} 0.3s ease-in-out;
`

export const StyledContainer = styled.div<{ placement: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 8px 0 0 8px;
  border-radius: ${(props) =>
    props.placement === "right" ? " 8px 0 0 8px" : "0 8px 8px 0"};
  position: relative;
  background: #ffffff;
  box-shadow: ${({ placement }) =>
    placement === "right"
      ? "-2px 2px 4px 0 rgba(215,214,214,0.28)"
      : "2px 2px 4px 0 rgba(215,214,214,0.28)"};
  background-repeat: no-repeat;
`

export const StyledLogo = styled.div`
  width: 120px;
  height: 36px;
  background-image: url(${logo});
  background-size: contain;
  background-repeat: no-repeat;
`

export const StyledActions = styled.div`
  color: #333;
`

export const StyledHeader = styled.div<{ shadowed: boolean }>`
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${({ shadowed }) =>
    shadowed ? "0px 4px 2px -2px rgba(195,200,205,0.43)" : undefined};
  flex: 0 0 auto;
  height: 75px;
`

export const StyledContent = styled.div`
  flex: 1 0 auto;
  margin: 0 12px;
  height: 1px;
  overflow: auto;
`

export const StyledFooter = styled.div`
  margin: 12px;
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const HistoryButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  margin: 15px 0;
  font-size: 12px;
  line-height: 1;
  color: #666;
  flex: 0 0 auto;
  > img {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
`

export const CloseButton = styled.div<{ placement: "left" | "right" }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scaleX(${(props) => (props.placement === "right" ? 1 : -1)});
  z-index: 20;
  top: 80px;
  ${(props) => (props.placement === "right" ? "left" : "right")}: -30px;
  font-size: 20px;
  width: 30px;
  height: 30px;
  background-image: linear-gradient(90deg, #3ca3f7 5%, #3b6cef 100%);
  border-radius: 4px 0 0 4px;
  cursor: pointer;
`
