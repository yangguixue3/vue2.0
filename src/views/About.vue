<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div class="block">
      <el-tree :data="menus" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.getmenus()
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },
    getmenus () {
      // http://localhost:88/api/product/category/list/tree
      axios.get('/api/product/category/list/tree').then((res) => {
        this.menus = res.data.data
        console.log('成功获取到菜单数据...', res.data)
        console.log('menus菜单数据...', this.menus)
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
