import { StarOutlined } from "@ant-design/icons"
import styled from "@emotion/styled"

export const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

export const StyledHeader = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 0 10px;
  height: 30px;
  width: 100%;
  background-color: green;
  align-items: center;
  justify-content: space-between;
`

export const StyledStarOutlined = styled(StarOutlined)<{ isFavorite }>`
  color: ${(props) => (props.isFavorite ? "red" : "white")};
  font-size: 16px;
`

export const StyledContent = styled.div`
  padding: 10px;
  max-height: 300px;
  overflow: auto;
`
