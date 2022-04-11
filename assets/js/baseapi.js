// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候会先调用这个函数 ajaxPrefilter 
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  // 在发起真正的ajax请求之前，统一拼接请求的根路径
  let baseURL = 'http://www.liulongbin.top:3007'
  options.url = baseURL + options.url
  console.log(options.url);
})