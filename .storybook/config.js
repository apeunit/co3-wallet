import { configure, addDecorator } from "@storybook/react"
import themeDecorator from "./themeDecorator"

import 'inter-ui/inter.css'
import '../src/App.css'

addDecorator(themeDecorator);