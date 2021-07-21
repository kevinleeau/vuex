<template>
  <div id="app">
    <!-- :value数据绑定在state里的inputValue中 -->
    <a-input placeholder="Please input task" class="my_ipt" :value="inputValue" @change="handleInputChange"/>
    <a-button type="primary" @click="addItemToList">Add Task</a-button>
    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- checked是内置属性，可以绑定数据源，发生change时触发行内箭头函数，并传递event -->
        <a-checkbox :checked="item.done" @change="(event) => { statusChange(event, item.id) }">{{ item.info }}</a-checkbox>
        <!-- 根据传进去的id来删除 -->
        <a slot="actions" @click="removeItemById(item.id)">Delete</a>
      </a-list-item>
    <div slot="footer" class="footer">
    <span v-if="doneCount === list.length">All Complete</span>
    <span v-else>{{unDoneCount}}&nbsp;&nbsp;Incomplete</span>
    <a-button-group>
      <!-- 函数可以传递字符串，带引号 -->
      <a-button :type="taskViewStatus === 'all' ? 'primary' : 'default'" @click="changeList('all')">All</a-button>
      <a-button :type="taskViewStatus === 'undone' ? 'primary' : 'default'" @click="changeList('undone')">InComplete</a-button>
      <a-button :type="taskViewStatus === 'done' ? 'primary' : 'default'" @click="changeList('done')">Complete</a-button>
    </a-button-group>
    <a @click="removeDoneItem">Remove Complete Task</a>
    </div>
   </a-list>
  </div>
</template>

<script>
// import mapState然后在computed里映射，在template里直接使用
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
    // 这里就没有数据源了，因为数据源来自网络，保存在vuex的store里
    }
  },
  created() {
    // dispatch专门触发actions里面的异步函数，异步函数请求数据传给mutations，mutations对state赋值
    this.$store.dispatch('getList')
  },
  computed: {
    // list在store的state里已经预定义，infoList是getters修饰后的数据
    ...mapState(['list', 'inputValue', 'taskViewStatus']),
    ...mapGetters(['infoList', 'unDoneCount', 'doneCount'])
  },
  methods: {
    // 监听input输入事件，并同步到store.state.inputValue里
    handleInputChange(event) {
      // commit专门触发mutations里面的函数，并把参数传进去
      this.$store.commit('setInputValue', event.target.value)
    },
    addItemToList() {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('Please input valid message')
      }
      // 点击按钮触发mutations里面的addItem函数
      this.$store.commit('addItem')
    },
    removeItemById(id) {
      // removeItem的具体逻辑在mutations里定义
      this.$store.commit('removeItem', id)
    },
    // 只要复选框发生变化，就触发这个函数，可以得到发生变化后的checked值，和当前id，再通过mutations修改数据状态，同时把params传给mutations
    statusChange(event, id) {
      console.log(event.target.checked, id)
      const params = {
        id: id,
        status: event.target.checked
      }
      this.$store.commit('changeStatus', params)
    },
    removeDoneItem() {
      this.$store.commit('removeDone')
    },
    changeList(currentStatus) {
      this.$store.commit('changeTaskViewStatus', currentStatus)
    }
  }
}
</script>

<style scoped>
  #app {
    padding: 10px;
  }
  .my_ipt {
    width: 600px;
    margin-right: 10px;
  }
  .dt_list {
    width: 600px;
    margin-top: 10px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
  }
</style>
