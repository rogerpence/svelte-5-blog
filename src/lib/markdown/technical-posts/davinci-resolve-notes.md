---
title: davinci-resolve-notes
description: davinci-resolve-notes
date_created: '2025-09-09T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - davinci
  - resolve
---
This video is pretty good. It has some good suggestions for default values.
https://www.youtube.com/watch?v=Mzd-BRZmWec

Fusion Tutorial
https://www.youtube.com/watch?v=gaFT_Kj2yeQ

Nodes
- triangles are inputs 
- boxes are outputs 

path colors: 
- yellow - background
- green - foreground
- blue - effect mask 


Node types



- Generator - nodes with output
- Merge - 

This is the Fusion composition that shows the intro text screen.

```
{
	Tools = ordered() {
		MediaOut1 = MediaOut {
			Inputs = {
				Index = Input { Value = "0", },
				Input = Input {
					SourceOp = "Merge4",
					Source = "Output",
				}
			},
			ViewInfo = OperatorInfo { Pos = { 1412, 223.44 } },
		},
		Merge2 = Merge {
			Inputs = {
				Background = Input {
					SourceOp = "Merge1",
					Source = "Output",
				},
				Foreground = Input {
					SourceOp = "presentedTask",
					Source = "Output",
				},
				Center = Input { Value = { 0.497, 0.5 }, },
				PerformDepthMerge = Input { Value = 0, }
			},
			ViewInfo = OperatorInfo { Pos = { 958.667, 215.848 } },
		},
		presentedTask = TextPlus {
			NameSet = true,
			Inputs = {
				GlobalIn = Input { Value = -30, },
				GlobalOut = Input { Value = 80, },
				Width = Input { Value = 1920, },
				Height = Input { Value = 1080, },
				UseFrameFormatSettings = Input { Value = 1, },
				["Gamut.SLogVersion"] = Input { Value = FuID { "SLog2" }, },
				Wrap = Input { Value = 1, },
				Center = Input { Value = { 0.47, 0.278 }, },
				LayoutRotation = Input { Value = 1, },
				TransformRotation = Input { Value = 1, },
				Red1 = Input { Value = 0.992156862745098, },
				Green1 = Input { Value = 0.992156862745098, },
				Blue1 = Input { Value = 0.992156862745098, },
				Softness1 = Input { Value = 1, },
				StyledText = Input { Value = "In the next video we'll look at the objects needed", },
				Font = Input { Value = "Open Sans", },
				Style = Input { Value = "Semibold Italic", },
				Size = Input { Value = 0.0551, },
				VerticalJustificationNew = Input { Value = 3, },
				HorizontalJustificationNew = Input { Value = 3, }
			},
			ViewInfo = OperatorInfo { Pos = { 738.667, 215.242 } },
		},
		Transform2 = Transform {
			CtrlWZoom = false,
			Inputs = {
				Center = Input {
					SourceOp = "Path1",
					Source = "Position",
				},
				Input = Input {
					SourceOp = "Merge2",
					Source = "Output",
				}
			},
			ViewInfo = OperatorInfo { Pos = { 1145.33, 187.364 } },
		},
		Path1 = PolyPath {
			DrawMode = "InsertAndModify",
			CtrlWZoom = false,
			Inputs = {
				Displacement = Input {
					SourceOp = "Path1Displacement",
					Source = "Value",
				},
				PolyLine = Input {
					Value = Polyline {
						Points = {
							{ Linear = true, LockY = true, X = -2.213, Y = 0, RX = 0.737666666666667, RY = 0 },
							{ Linear = true, LockY = true, X = 0, Y = 0, LX = -0.737666666666667, LY = 0 }
						}
					},
				}
			},
		},
		Path1Displacement = BezierSpline {
			SplineColor = { Red = 255, Green = 0, Blue = 255 },
			CtrlWZoom = false,
			KeyFrames = {
				[1] = { 0, RH = { 14.6666666666667, 0 }, Flags = { Linear = true, LockedY = true } },
				[42] = { 1, LH = { 28.3333333333333, 1 }, Flags = { LockedY = true } }
			}
		},
		productName = TextPlus {
			NameSet = true,
			Inputs = {
				GlobalIn = Input { Value = -30, },
				GlobalOut = Input { Value = 80, },
				Width = Input { Value = 1920, },
				Height = Input { Value = 1080, },
				UseFrameFormatSettings = Input { Value = 1, },
				["Gamut.SLogVersion"] = Input { Value = FuID { "SLog2" }, },
				Wrap = Input { Value = 1, },
				Center = Input { Value = { 0.325, 0.409 }, },
				LayoutRotation = Input { Value = 1, },
				TransformRotation = Input { Value = 1, },
				Softness1 = Input { Value = 1, },
				StyledText = Input { Value = "Monarch in Action", },
				Font = Input { Value = "Open Sans", },
				Style = Input { Value = "Bold", },
				VerticalJustificationNew = Input { Value = 3, },
				HorizontalJustificationNew = Input { Value = 3, }
			},
			ViewInfo = OperatorInfo { Pos = { 736.667, 166.424 } },
		},
		Merge1 = Merge {
			Inputs = {
				Background = Input {
					SourceOp = "Merge3",
					Source = "Output",
				},
				Foreground = Input {
					SourceOp = "productName",
					Source = "Output",
				},
				PerformDepthMerge = Input { Value = 0, }
			},
			ViewInfo = OperatorInfo { Pos = { 958.667, 165.545 } },
		},
		Merge3 = Merge {
			Inputs = {
				Background = Input {
					SourceOp = "Transform1",
					Source = "Output",
				},
				Center = Input { Value = { 0.418, 0.491 }, },
				PerformDepthMerge = Input { Value = 0, }
			},
			ViewInfo = OperatorInfo { Pos = { 960, 110.394 } },
		},
		Transform1 = Transform {
			Inputs = {
				Center = Input { Value = { 0.23, 0.5 }, },
				Size = Input { Value = 1.95, },
				Input = Input {
					SourceOp = "ASNAlogo",
					Source = "Output",
				}
			},
			ViewInfo = OperatorInfo { Pos = { 815.333, 111 } },
		},
		ASNAlogo = MediaIn {
			NameSet = true,
			CustomData = { MEDIA_ID = "87f7a501-177c-4edb-a1c5-969ead0763b7", MediaProps = { MEDIA_NUM_LAYERS = 0, MEDIA_FORMAT_TYPE = "PNG", MEDIA_PAR = 1, MEDIA_LAYER_DESC = {
					}, MEDIA_NAME = "asna-logo-white-600.png", MEDIA_PATH = "C:\\Users\\thumb\\Downloads\\asna-logo-white-600.png", MEDIA_START_FRAME = 0, MEDIA_IS_SOURCE_RES = true, MEDIA_SRC_FRAME_RATE = 30, MEDIA_MARK_OUT = 0, MEDIA_WIDTH = 600, MEDIA_NUM_FRAMES = 1, MEDIA_MARK_IN = 0, MEDIA_HEIGHT = 40 }, },
			Inputs = {
				GlobalIn = Input { Value = -30, },
				GlobalOut = Input { Value = 80, },
				MediaSource = Input { Value = FuID { "MediaPool" }, },
				MediaID = Input { Value = "87f7a501-177c-4edb-a1c5-969ead0763b7", },
				AudioTrack = Input { Value = FuID { "Timeline Audio" }, },
				Layer = Input { Value = "", },
				ClipTimeEnd = Input { Value = 0, },
				Loop = Input { Value = 1, },
				["Gamut.SLogVersion"] = Input { Value = FuID { "SLog2" }, },
				DeepOutputMode = Input {
					Value = 0,
					Disabled = true,
				},
				LeftAudio = Input {
					SourceOp = "Left",
					Source = "Data",
				},
				RightAudio = Input {
					SourceOp = "Right",
					Source = "Data",
				}
			},
			ViewInfo = OperatorInfo { Pos = { 660, 110.394 } },
			Version = 1
		},
		Left = AudioDisplay {
			CtrlWZoom = false,
		},
		Right = AudioDisplay {
			CtrlWZoom = false,
		},
		Merge4 = Merge {
			Inputs = {
				Background = Input {
					SourceOp = "Merge5",
					Source = "Output",
				},
				Foreground = Input {
					SourceOp = "Transform2",
					Source = "Output",
				},
				PerformDepthMerge = Input { Value = 0, }
			},
			ViewInfo = OperatorInfo { Pos = { 1254, 103.121 } },
		},
		Background1 = Background {
			Inputs = {
				GlobalIn = Input { Value = -30, },
				GlobalOut = Input { Value = 80, },
				Width = Input { Value = 1920, },
				Height = Input { Value = 1080, },
				UseFrameFormatSettings = Input { Value = 1, },
				["Gamut.SLogVersion"] = Input { Value = FuID { "SLog2" }, },
				TopLeftGreen = Input { Value = 0.333333333333333, },
				TopLeftBlue = Input { Value = 1, }
			},
			ViewInfo = OperatorInfo { Pos = { 814.667, 74.6364 } },
		},
		Merge5 = Merge {
			Inputs = {
				Background = Input {
					SourceOp = "Background1",
					Source = "Output",
				},
				PerformDepthMerge = Input { Value = 0, }
			},
			ViewInfo = OperatorInfo { Pos = { 1252.67, 60.0909 } },
		}
	}
}
```