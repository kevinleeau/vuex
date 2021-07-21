import Vue from 'vue'
import Vuex from 'vuex'
// 通过axiox发起数据请求，数据源在public/list.json里
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // state预定义数据源库为空
    list: [],
    // inputValue为用户文本输入框内数据
    inputValue: '',
    nextId: 4,
    // taskStatus定义页面task显示条件状态，默认all全部，
    taskViewStatus: 'all'
  },
  mutations: {
    // mutations负责把请求回来的数据**赋值**在state的list里
    initList(state, outsideList) {
      state.list = outsideList
    },
    // inputSource是用户在输入框的内容数据
    setInputValue(state, inputSource) {
      state.inputValue = inputSource
    },
    // 接收用户输入的信息，并添加到state.list中
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    removeItem(state, id) {
      // 根据id查找对应的state.list索引值，判断当前item的id是否和传进来的id相等
      const currentIndex = state.list.findIndex(currentItem => currentItem.id === id)
      if (currentIndex !== -1) { state.list.splice(currentIndex, 1) }
    },
    changeStatus(state, params) {
      const currentIndex = state.list.findIndex(currentItem => currentItem.id === params.id)
      if (currentIndex !== -1) { state.list[currentIndex].done = params.status }
    },
    removeDone(state) {
      // 这个state.list是重新赋值后所有done等于false的array(imcomplete)
      state.list = state.list.filter(items => items.done === false)
    },
    changeTaskViewStatus(state, currentStatus) {
      state.taskViewStatus = currentStatus
    }
  },
  actions: {
    // 网络请求是异步操作，所以数据请求定义在actions里，然后用commit触发mutations里的initList函数，把res传进去
    getList(context) {
      axios.get('./list.json').then(({ data: res }) => {
        context.commit('initList', res)
      })
    }
  },
  getters: {
    // 统计未完成的数量
    unDoneCount(state) {
      // 条件过滤得出items是array，然后计算lenght
      return state.list.filter(items => items.done === false).length
    },
    doneCount(state) {
      return state.list.filter(items => items.done === true).length
    },
    infoList(state) {
      if (state.taskViewStatus === 'all') {
        return state.list
      }
      if (state.taskViewStatus === 'undone') {
        return state.list.filter(items => !items.done)
      }
      if (state.taskViewStatus === 'done') {
        return state.list.filter(items => items.done)
      }
      return state.list
    }
  }
})
