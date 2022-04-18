$(function () {
  // 调用 getUserInfo 获取用户基本信息
  getUserInfo()

  var layer = layui.layer

  // 点击按钮 实现退出功能
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 1.清空本地存储的 token
      localStorage.removeItem('token')
      // 2.重新跳转到登录页
      location.href = '/login.html'

      // 关闭 confirm 询问框
      layer.close(index);
    });
  })
})

// 获取用户的基本信息
function getUserInfo() {
  $.ajax({
    method: "get",
    url: '/my/userinfo',
    // 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
      // 调用 renderAvatar 函数渲染用户的头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败，最终都会调用 complete 回调函数
    // 控制用户的访问权限
    complete: function (res) {
      // console.log('执行了 complete 回调函数');
      // console.log(res);
      // 在 complete 回调函数中可以使用 res.responseJSON 拿到服务器响应回来的数据
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 1.强制清空token
        localStorage.removeItem('token')
        // 2.强制跳转到登录页面
        location.href = '/login.html'
      }
    }
  })
}

// 渲染用户头像的函数
function renderAvatar(user) {
  // 获取用户的名称
  var name = user.nickname || user.username
  // 设置文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    // 隐藏文本头像
    $('.text-avatar').hide()
  } else {
    // 隐藏图片头像
    $('.layui-nav-img').hide()
    // 渲染文本头像
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}