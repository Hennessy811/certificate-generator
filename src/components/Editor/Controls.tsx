import React from "react"

import { Delete } from "@mui/icons-material"
import AlignHorizontalCenterIcon from "@mui/icons-material/AlignHorizontalCenter"
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter"
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom"
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop"
import { Button, ButtonGroup, Menu, MenuItem, Tooltip } from "@mui/material"
import { fabric } from "fabric"

import { Format } from "./Editor"

const Controls = ({
  canvas,
  element,
  format,
  onFormatChange,
  onDelete,
}: {
  element: fabric.Text | fabric.Image | null
  canvas: fabric.Canvas
  format: Format
  onFormatChange: (format: Format) => void
  onDelete: () => void
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <ButtonGroup>
          <Tooltip title="Align Horizontal Center">
            <Button>
              <AlignHorizontalCenterIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Align Vertical Center">
            <Button>
              <AlignVerticalCenterIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup className="ml-2">
          <Tooltip title="Move Forward">
            <Button
              onClick={() => {
                element?.bringForward()
              }}
            >
              <VerticalAlignTopIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Move Backward">
            <Button
              onClick={() => {
                element?.sendBackwards()
              }}
            >
              <VerticalAlignBottomIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>

        {/* <Box ml={2}>
          <Button variant="outlined" onClick={handleClick}>
            {format}
          </Button>
        </Box> */}
      </div>

      <Button
        variant="outlined"
        color="error"
        disabled={!element}
        onClick={() => {
          canvas.remove(element!)
          onDelete()
        }}
      >
        <Delete />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          dense: true,
        }}
      >
        <MenuItem
          onClick={() => {
            onFormatChange("1x1")
            handleClose()
          }}
        >
          1x1
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFormatChange("4x3")
            handleClose()
          }}
        >
          4x3
        </MenuItem>
        <MenuItem
          onClick={() => {
            onFormatChange("16x9")
            handleClose()
          }}
        >
          16x9
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Controls
