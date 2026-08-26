import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import Navigation from "./quartz/components/Navigation"

const config = await loadQuartzConfig()
export default config
const navigation = [Navigation()]
export const layout = await loadQuartzLayout({
  defaults: {
    header: navigation,
  },
  byPageType: {
    content: { header: navigation },
    folder: { header: navigation },
    tag: { header: navigation },
  },
})
