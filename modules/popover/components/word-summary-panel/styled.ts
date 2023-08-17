import { StarOutlined } from "@ant-design/icons"
import styled from "@emotion/styled"

export const StyledStarOutlined = styled(StarOutlined)<{ isFavorite }>`
  color: ${(props) => (props.isFavorite ? "red" : "white")};
  font-size: 16px;
`

export const StyledContent = styled.div`
  padding: 10px;
  max-height: 300px;
  overflow: auto;
`
