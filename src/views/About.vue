<template>
  <div class="about">
    <h1>This is an about page</h1>
    <el-button type='danger' @click='batchDelete'>批量删除</el-button>
    <div class="block">
      <el-tree
        :data="menus"
        node-key='catId'
        ref='menuTree'
        show-checkbox
        :default-expanded-keys='expandedKey'
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
      <span class='custom-tree-node' slot-scope='{ node, data }'>
        <span @click='()=> jumpto(node, data)'>{{ node.label }}</span>
          <el-button size="mini"  type="text" v-if="node.level<3" @click="()=>append(node,data)">增加</el-button>
          <el-button size="mini"  type="text"  @click='edit(node,data)'>修改</el-button>
          <el-button size="mini"  type="text" v-if="node.childNodes.length==0" @click='remove(node,data)'>删除</el-button>
      </span>
      </el-tree>
       <!-- 添加dialog窗口 -->
      <el-dialog :title="title"  width='30%' top = '8px' :visible.sync="dialogVisible">
        <el-form :model="category">
          <el-form-item label="名称" >
            <el-input v-model="category.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="父类id" v-if="isShow">
            <el-input v-model="category.parentCid" :disabled="canWrite" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="层级" v-if="isShow">
            <el-input v-model="category.catLevel" :disabled="canWrite" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否显示" v-if="isShow">
            <el-input v-model="category.showStatus" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" :disabled="canWrite" v-if="productCountIsShow">
            <el-input v-model="category.productCount" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      canWrite: true,
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 默认展开的数组
      expandedKey: [],
      // dialog窗口标题
      title: '',
      // 动态窗口 默认关闭
      dialogVisible: false,
      productCountIsShow: false,
      isShow: true,
      category: {
        name: '',
        parentCid: '',
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        productUnit: '',
        icon: '',
        catId: null,
        productCount: ''
      }
    }
  },
  created () {
    this.getmenus()
  },
  methods: {
    remove (node, data) {
      console.log('要删除的数据', data)
      var ids = [data.catId]
      this.$confirm(`是否删除【${data.name}】菜单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/api/product/category/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            this.$message({
              message: '菜单删除成功',
              type: 'success'
            })
            // 刷新出新的菜单
            this.getMenus()
            // 设置需要默认展开的菜单
            this.expandedKey = [node.parent.data.catId]
          })
        })
        .catch(() => {})
    },
    edit (node, data) {
      console.log('要修改的数据', data)
      this.dialogType = 'edit'
      this.title = '修改菜单属性'
      this.dialogVisible = true
      // dialog 属性栏是否显示
      if (node.childNodes.length === 0) {
        this.productCountIsShow = true
      } else {
        this.productCountIsShow = false
      }
      this.$http({
        url: this.$http.adornUrl(`/api/product/category/info/${data.catId}`),
        method: 'get'
      }).then(({ data }) => {
        // 请求成功 回显
        console.log('要回显的数据', data)
        this.category.name = data.category.name
        this.category.catId = data.category.catId
        this.category.icon = data.category.icon
        this.category.productUnit = data.category.productUnit
        this.category.parentCid = data.category.parentCid
        this.category.catLevel = data.category.catLevel
        this.category.sort = data.category.sort
        this.category.showStatus = data.category.showStatus
      })
    },
    append (node, data) {
      console.log('要添加的菜单数据', data)
      this.dialogType = 'add'
      this.title = '添加菜单'
      // dialog 属性栏是否显示
      if (node.childNodes.length === 0) {
        this.productCountIsShow = true
      } else {
        this.productCountIsShow = false
      }
      this.dialogVisible = true
      // 层级预设值
      this.category.catLevel = data.catLevel + 1
      // 窗口数据清空
      this.category.catId = null
      this.category.name = ''
      this.category.icon = ''
      this.category.productUnit = ''
      this.category.sort = 0
      this.category.showStatus = 1
      this.category.parentCid = data.parentCid
    },
    // 未完成，点击菜单名字事件
    jumpto (node, data) {
      console.log('node未完成，点击菜单名字事件。。。', node.childNodes)
    },
    batchDelete () {
      const catIds = []
      const names = []
      // getCheckedNodes()返回被选中的节点所组成的对象数组，menuTree 树的名称，show-checkbox绑定
      const checkedNodes = this.$refs.menuTree.getCheckedNodes()
      // 判断对象数组长度，不等于0调用Dialog
      if (checkedNodes.length !== 0) {
        console.log('batchDelete被选中的元素', checkedNodes)
        for (var i = 0; i < checkedNodes.length; i++) {
          console.log('被选中元素', checkedNodes[i])
          catIds.push(checkedNodes[i].catId)
          names.push(checkedNodes[i].name)
        }
        this.$confirm(`是否批量删除【${names}】菜单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/api/product/category/delete'),
            method: 'post',
            data: this.$http.adornData(catIds, false)
          }).then((data) => {
            console.log(data)
            this.$message({
              message: '菜单批量删除成功',
              type: 'success'
            })
            this.getmenus()
          })
        }).catch(() => {})
      }
    },
    handleNodeClick (data) {
      console.log(data)
    },
    getmenus () {
      // http://localhost:88/api/product/category/list/tree
      this.$http.get('/api/product/category/list/tree').then((res) => {
        this.menus = res.data.data
        console.log('成功获取到菜单数据...', res.data)
      })
    },
    submitData () {
      if (this.dialogType === 'edit') {
        this.editCategory()
        // 刷新出新的菜单
      }
      if (this.dialogType === 'add') {
        this.addCategory()
        // 刷新出新的菜单
      }
    },
    editCategory () {
      var { name, parentCid, catLevel, showStatus, sort, productUnit, icon, catId, productCount } = this.category
      this.$http({
        url: this.$http.adornUrl('/api/product/category/update'),
        method: 'post',
        data: this.$http.adornData({ name, parentCid, catLevel, showStatus, sort, productUnit, icon, catId, productCount }, false)
      }).then((data) => {
        this.$message({
          type: 'success',
          message: '菜单修改成功'
        })
        // 关闭对话框
        this.dialogVisible = false
        this.getmenus()
        // 设置需要默认展开的菜单
        this.expandedKey = [this.category.parentCid]
      })
    },
    // 添加菜单，只能添加子菜单
    addCategory () {
      this.$http({
        url: this.$http.adornUrl('/api/product/category/save'),
        method: 'post',
        data: this.$http.adornData(this.category, false)
      }).then((data) => {
        this.$message({
          type: 'success',
          message: '添菜单成功'
        })
        // 关闭对话框
        this.dialogVisible = false
        this.getmenus()
        // 设置需要默认展开的菜单
        this.expandedKey = [this.category.parentCid]
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
