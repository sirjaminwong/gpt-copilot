import styled from "@emotion/styled"
import { useDebounceEffect } from "ahooks"
import logo from "data-base64:~assets/logo.png"
import React, {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { getLocalStorageKey } from "~utils/local-storage"

const zIndex = 1000

interface Props {
  onClick: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function Pin(props: Props) {
  const [storagePositionY, setStoragePositionY] = useStorage<
    number | undefined
  >(getLocalStorageKey("positionY"))
  const [positionY, setPositionY] = useState<number | undefined>(
    () => storagePositionY
  )

  useDebounceEffect(
    () => {
      setStoragePositionY(positionY)
    },
    [positionY],
    {
      wait: 1000
    }
  )

  const [isDragging, setIsDragging] = useState(false)

  const siderButtonRef = useRef<HTMLDivElement>(null)

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault()
      setIsDragging(true)
    },
    []
  )

  useEffect(() => {
    if (!isDragging) return undefined
    const handleMouseMove = (event: MouseEvent) => {
      const min = 23
      const max = window.innerHeight - 23
      setPositionY(Math.max(min, Math.min(max, event.clientY)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, setPositionY])

  const siderButtonStyle: React.CSSProperties = useMemo(() => {
    return {
      top: positionY ?? "50%",
      cursor: isDragging ? "move" : "pointer",
      zIndex
    }
  }, [isDragging, positionY])

  const handleClick = useCallback(() => {
    if (isDragging) return

    props.onClick()
  }, [isDragging, props])

  return (
    <StyledPin
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      ref={siderButtonRef}
      style={siderButtonStyle}
      placement={"right"}
    />
  )
}

export default Pin

const StyledPin = styled.div<{ placement: "left" | "right" }>`
  position: fixed;
  height: 46px;
  transform: translateY(-50%);
  width: 46px;
  ${(props) => props.placement}: 0;
  border-radius: 50%;
  background-image: url(${logo});
  background-color: #fff;
  background-size: 80% 80%;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`
