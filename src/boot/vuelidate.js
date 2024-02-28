
import useVuelidate from '@vuelidate/core'

export default async ({ app }) => {
  app.config.globalProperties.$v = useVuelidate()
}
