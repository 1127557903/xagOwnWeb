<template>
  <div
    ref="input"
    class="content"
    contenteditable="true"
    v-html="innerText"
    @input="changeText"
    :data-star="label"
    :style="{height: hei == 1?'unset':'hei',flex:hei == 1?1:'unset'}"
  ></div>
</template>
<script>
export default {
  props: {
    value: {
      default:''
    },
    // 高度
    hei: {
      default: 1,
    },
    label: {
      default: '我有话要说...',
      type:[String]
    },
  },
  data() {
    return { innerText: "" };
  },
  methods: {
    changeText() {
      this.innerText = this.$el.innerHTML;
      this.$emit("input", this.innerText);
      let that = this;
      this.$nextTick(() => {
        that.lastfocus();
      });
    },
    // 聚焦到最后
    lastfocus() {
      let el = this.$refs.input; // jquery 对象转dom对象
      el.focus();
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
  },
  watch: {
    value: {
      handler(val) {
        this.innerText = val;
      },
      deep: true,
    }
  },
};
</script>
<style lang="less" scoped>
.content {
  height: 50px;
  padding: 8px 16px;
  overflow: scroll;
}
.content:focus {
  border: none;
  outline: none;
  // -webkit-appearance: none;
  // -webkit-user-select: none;
  // -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  // -webkit-touch-callout: none;
  // -webkit-text-size-adjust: none;
  // color: rgba(0, 0, 0, 0);
  // background-color: #fff;
}
.content:empty:after {
  content: attr(data-star);
  color: #ababab;
  font-size: 14px;
  text-align: left;
}
</style>