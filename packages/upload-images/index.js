import ImgUpload from './src/main'

ImgUpload.install = function (Vue) {
    Vue.component(ImgUpload.name, ImgUpload)
}

if (typeof window !== "undefined" && window.Vue) {
    console.log('走到这里了:', window, window.Vue, window.Vue.component)
    window.Vue.component(ImgUpload.name, ImgUpload)
}

export default ImgUpload
