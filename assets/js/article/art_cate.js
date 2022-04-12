$(function () {
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'get',
      url: "/my/article/cates",
      success: function (res) {
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      title: '添加文章分类',
      content: $('#dialog-add').html(),
      type: 1,
      area: ['500px', '250px'], // 宽高
    })
  })

  // 通过代理的形式为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    // 组织表单的默认提交行为
    e.preventDefault();
    // 发起 Ajax 请求
    $.ajax({
      method: "post",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 刷新列表数据
        initArtCateList()
        layer.msg(res.message)
        // 根据索引关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出修改文章分类信息的弹出框
    indexEdit = layer.open({
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
      type: 1,
      area: ['500px', '250px'], // 宽高
    })

    // 拿到当前行对应的id
    var id = $(this).attr('data-id')
    // 发请求获取对应的数据
    $.ajax({
      method: "get",
      url: '/my/article/cates/' + id,
      success: function (res) {
        console.log(res);
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式为修改分类的表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: "post",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 通过代理的形式为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function (e) {
    var id = $(this).attr('data-id')
    // 提示用户是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: "get",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          layer.close(index);
          initArtCateList()
        }
      })
    });
  })
})