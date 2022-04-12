$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (date) {
    const dt = new Date(date)
    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // 定义一个查询的参数对象
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示两条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  }

  initTable();
  initCate();

  // 获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: "get",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通知layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的ID
      count: total, // 数据总数，从服务端得到
      limit: q.pagesize, // 每页显示的条数
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      // 分页发生切换的时候，触发 jump 回调
      // 触发 jump 回调的方式有两种：
      // 1.点击页码的时候会触发 jump 回调 first = undefined
      // 2.只要调用了laypage.render() 方法就会触发 jump 回调 first = true
      // 可以通过 first 的值来判断是哪种方式触发的 jump 回调函数
      jump: function (obj, first) {
        // obj包含了当前分页的所有参数，比如：
        // 得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.curr); 
        // 把最新的页码值，赋值到 q 这个查询参数对象中
        q.pagenum = obj.curr
        // 得到每页显示的条数
        // console.log(obj.limit); 
        // 把最新的条目数，赋值到 q 这个查询参数对象中
        q.pagesize = obj.limit

        if (!first) {
          // 根据最新的 q 获取到的数据列表，并渲染表格
          initTable()
        }
      }
    });
  }

  // 通过代理的形式为删除按钮绑定点击事件处理函数
  $("tbody").on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: "get",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message)
          }
          layer.msg(res.message)
          // 当数据删除完成后需要判断当前这一页中是否还有剩余的数据，
          // 如果没有剩余的数据了则让页码值减一之后，
          // 再重新调用 initTable 方法
          if (len === 1) {
            // 如果 len 的值等于1 证明删除完毕之后，页面上就没有任何数据
            // 页码值减一 页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })

      layer.close(index);
    });
  })
})