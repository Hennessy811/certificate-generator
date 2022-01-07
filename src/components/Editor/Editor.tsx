import React, { useEffect, useRef, useState } from "react"

import { Download } from "@mui/icons-material"
import { Button } from "@mui/material"
import { fabric } from "fabric"

import Controls from "./Controls"

export type Format = "4x3" | "16x9" | "1x1"

const draw = () => {
  const canvas = new fabric.Canvas("editor", {
    // backgroundImage: "https://source.unsplash.com/random",
    backgroundColor: "#aeaeae",
  })
  return canvas
}

const formats: Record<Format, [number, number]> = {
  "4x3": [1024 / 2, 768 / 2],
  "16x9": [1920 / 2, 1080 / 2],
  "1x1": [512, 512],
}

interface Props {
  sampleRow: Record<string, string | null>
}

const Editor = ({ sampleRow }: Props) => {
  const cnv = useRef<HTMLCanvasElement>(null)

  const [format, setFormat] = useState<Format>("4x3")
  const WIDTH = formats[format][0]
  const HEIGHT = formats[format][1]

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [items, setItems] = useState<any>(null)
  const [activeItem, setActiveItem] = useState<
    fabric.Text | fabric.Image | null
  >(null)

  const drawSample = (canvas: fabric.Canvas) => {
    canvas.clear()
    const title = new fabric.Textbox("CERTIFICATE OF PARTICIPATION", {
      fontSize: 16,
      left: 250,
      top: 100,
      textAlign: "center",
      fill: "#000",
      width: WIDTH / 2,
    })

    title.on("selected", () => setActiveItem(title))
    title.set({
      left: (WIDTH - title.width!) / 2,
    })

    const subTitle = new fabric.Textbox("This is to certify that", {
      fontSize: 14,
      left: 250,
      top: 150,
      textAlign: "center",
      fill: "#000",

      width: WIDTH / 2,
    })

    subTitle.on("selected", () => setActiveItem(subTitle))
    subTitle.set({
      left: (WIDTH - subTitle.width!) / 2,
    })

    const name = new fabric.Textbox("Jane Doe", {
      fontSize: 28,
      left: 250,
      top: 190,
      textAlign: "center",
      fill: "#000",
      fontFamily: "Arial",
      width: WIDTH / 2,
    })

    name.on("selected", () => setActiveItem(name))
    name.set({
      left: (WIDTH - name.width!) / 2,
    })

    const course = new fabric.Textbox("Successfully completed the course", {
      fontSize: 16,
      left: 250,
      top: 230,
      textAlign: "center",
      fill: "#000",
      width: WIDTH / 2,
    })

    course.on("selected", () => setActiveItem(course))
    course.set({
      left: (WIDTH - course.width!) / 2,
    })

    canvas.add(title)
    canvas.add(subTitle)
    canvas.add(name)
    canvas.add(course)
  }

  useEffect(() => {
    const canvas = draw()
    setCanvas(canvas)
    drawSample(canvas)

    return () => {
      canvas.dispose()
    }
  }, [])

  const updateItems = () => {
    if (canvas) {
      const items = canvas.getObjects()
      setItems(items)
    }
  }

  useEffect(() => {
    updateItems()
  }, [canvas])

  // redraw the canvas when the format changes
  //   useEffect(() => {
  //     if (canvas && cnv.current) {
  //       cnv.current.width = WIDTH
  //       cnv.current.height = HEIGHT

  //       canvas.setWidth(WIDTH)
  //       canvas.setHeight(HEIGHT)
  //       canvas.renderAll()
  //     }
  //   }, [format])

  const handleFormatChange = (format: Format) => {
    setFormat(format)
    setCanvas(draw())
  }

  const addText = (text: string, canvas: fabric.Canvas) => {
    const node = new fabric.Text(text, {
      left: 100,
      top: 100,
      fontSize: 36,
      fill: "#333",
    })

    node.set({
      left: (WIDTH - node.width!) / 2,
    })

    node.on("selected", () => setActiveItem(node))
    canvas.add(node)
    updateItems()
  }

  const addTextbox = (text: string, canvas: fabric.Canvas) => {
    const node = new fabric.Textbox(text, {
      left: 100,
      top: 100,
      fontSize: 36,
      fill: "#333",
      width: 200,
    })

    node.set({
      left: (WIDTH - node.width!) / 2,
    })

    node.on("selected", () => setActiveItem(node))

    canvas.add(node)
    updateItems()
  }

  const addImage = (src: string, canvas: fabric.Canvas) => {
    fabric.Image.fromURL(src, (i) => {
      i.set({
        left: 0,
        top: 0,
      })
      i.scaleToHeight(HEIGHT)
      i.scaleToWidth(WIDTH)

      canvas.setBackgroundImage(i, canvas.renderAll.bind(canvas))
    })
  }

  return (
    <div className="flex mt-4 space-x-4">
      <div className="w-full max-w-xs">
        <p className="text-xl font-semibold ">Layers</p>

        <div className="mt-4">
          <div className="flex flex-col">
            {items?.map(
              (
                item: { id: React.Key | null | undefined; text: any },
                idx: number
              ) => (
                <div
                  key={item.id}
                  className="p-2 transition border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    // @ts-ignore
                    canvas?.setActiveObject(canvas.item(idx))
                    canvas?.renderAll()
                  }}
                >
                  <div>{item.text || "?"}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <div>
          {canvas && (
            <Controls
              canvas={canvas}
              element={activeItem}
              format={format}
              onFormatChange={handleFormatChange}
              onDelete={() => updateItems()}
            />
          )}
        </div>
        <canvas
          ref={cnv}
          className="mt-4 border border-gray-700"
          width={WIDTH}
          height={HEIGHT}
          id="editor"
        ></canvas>
      </div>

      <div className="w-4"></div>

      {canvas && (
        <div>
          <p className="text-xl font-semibold">Available fields:</p>

          <div className="flex flex-col mt-4 space-y-2">
            {Object.entries(sampleRow)
              .filter(([, v]) => !!v)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between px-3 py-2 space-x-4 border rounded"
                >
                  <div>
                    <span className="font-mono font-semibold">{key}:</span>
                    <span className="ml-2">{value}</span>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      className="flex px-4 py-1 font-mono transition border rounded hover:bg-gray-50 hover:text-slate-700"
                      onClick={() => addText(value!, canvas)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}

            <div className="flex items-center justify-between px-3 py-2 space-x-4 border rounded">
              <div>
                <span className="font-mono font-semibold">Textbox</span>
              </div>

              <div className="flex">
                <button
                  type="button"
                  className="flex px-4 py-1 font-mono transition border rounded hover:bg-gray-50 hover:text-slate-700"
                  onClick={() => addTextbox("lorem ipsum", canvas)}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="h-8"></div>

          <div className="flex flex-col items-start justify-between px-3 py-2 space-x-4 border rounded">
            <div>
              <span className="font-mono font-semibold">Background:</span>
              <span className="ml-2">image </span>
            </div>

            <div className="flex mt-4">
              <input
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files![0]
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    if (e.target?.result)
                      addImage(e.target.result as string, canvas)
                  }
                  reader.readAsDataURL(file)
                }}
              />
            </div>
          </div>

          <div className="h-8"></div>

          <div>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                const dataURL = canvas?.toDataURL({
                  width: WIDTH,
                  height: HEIGHT,
                  enableRetinaScaling: true,
                  format: "jpg",
                  quality: 1,
                })

                //   save Data URL
                const a = document.createElement("a")
                a.href = dataURL
                a.download = "image.jpg"
                a.click()
              }}
            >
              Download sample
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor
