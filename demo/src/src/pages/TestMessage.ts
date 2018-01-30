/**
 * 用来测试消息的页面
 */
class TestMessage extends eui.UILayer {
  /**
   * 添加到舞台
   */
  protected createChildren() {
    Message.success({
      text: '提醒消息'
    }, this.parent)
  }
}