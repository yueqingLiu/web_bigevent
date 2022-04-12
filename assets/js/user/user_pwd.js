$(function () {
  var form = layui.form
  var layer = layui.layer

  // 自定义表单验证
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 组织表单的默认提交行为
    e.preventDefault();
    // 发起 Ajax 请求
    $.ajax({
      method: "post",
      url: '/my/updatepwd',
      // 快速获取表单信息 $(this).serialize()
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        // 重置表单 reset()函数 只能通过原生的formDOM对象调用
        $('.layui-form')[0].reset()
      }
    })
  })
})