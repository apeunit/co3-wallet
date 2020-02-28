import React from "react"
import theme from '../src/themes/co3'
import { ThemeProvider } from 'emotion-theming'

const ThemeDecorator = storyFn => (
  <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
)

export default ThemeDecorator