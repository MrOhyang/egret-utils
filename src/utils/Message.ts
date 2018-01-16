/**
 * 消息提醒弹框
 */
class Message extends eui.Group {
    private text: string;  // 提醒的消息
    private type: string;  // 样式类型
    private duration: number;  // 持续时间

    private down_len: number;  // 动画下降距离

    /**
     * @param thisObject 当前的显示对象
     */
    public constructor({text, type = 'success', duration = 2000}: {
        text: string,
        type?: string,
        duration?: number
    }, thisObject: egret.DisplayObjectContainer) {
        super();
        this.text = text;
        this.type = type;
        this.duration = duration;
 
        this.down_len = 50;

        thisObject.addChild(this);
    }

    // 初始化
    protected createChildren() {
        this.layout = new eui.BasicLayout();
        this.percentWidth = 90;
        this.x = 0.5 * 0.1 * this.stage.stageWidth;
        this.y = this.x;
        // this.height = 100;
        this.drawBg();
        this.drawIcon();
        this.drawLabel();
        this.show();
    }

    // 绘制背景
    private drawBg() {
        let bg: eui.Rect = new eui.Rect();
        this.addChild(bg);
        bg.percentWidth = 100;
        bg.percentHeight = 100;
        bg.ellipseHeight = 14;
        bg.ellipseWidth = 14;
        bg.strokeWeight = 1;
        switch (this.type) {
            case 'error':
                bg.fillColor = 0xffeeee;
                bg.strokeColor = 0xfedddd;
                break;
            case 'success':
            default:
                bg.fillColor = 0xf0f9eb;
                bg.strokeColor = 0xe1f3d8;
                break;
        }
    }

    // 绘制图标
    private drawIcon() {
        let shp: egret.Shape = new egret.Shape();
        this.addChild(shp);

        shp.x = 30;
        shp.y = 22;

        // 绘制圆圈背景
        let bg_color = 0x67c23a;
        switch (this.type) {
            case 'error':
                bg_color = 0xfa5555;
                break;
        }
        shp.graphics.beginFill(bg_color);
        shp.graphics.drawCircle(13, 13, 13);
        shp.graphics.endFill();

        switch (this.type) {
            case 'error':
                shp.graphics.lineStyle(2, 0xffffff);
                shp.graphics.moveTo(8, 8);
                shp.graphics.lineTo(18, 18);
                shp.graphics.moveTo(8, 18);
                shp.graphics.lineTo(18, 8);
                shp.graphics.endFill();
                break;
            case 'success':
            default:
                shp.graphics.lineStyle(3, 0xffffff);
                shp.graphics.moveTo(7, 13);
                shp.graphics.lineTo(11, 18);
                shp.graphics.endFill();

                shp.graphics.lineStyle(2, 0xffffff);
                shp.graphics.moveTo(12, 18);
                shp.graphics.lineTo(20, 7);
                shp.graphics.lineTo(12, 19);
                shp.graphics.endFill();
                break;
        }
    }

    // 绘制文字
    private drawLabel() {
        let label: eui.Label = new eui.Label;
        this.addChild(label);
        label.text = this.text;
        label.size = 26;
        label.fontFamily = 'Microsoft Yahei';
        label.top = 20;
        label.bottom = 20;
        label.left = 30 + 40;
        label.right = 30;
        switch (this.type) {
            case 'error':
                label.textColor = 0xfa5555;
                break;
            case 'success':
            default:
                label.textColor = 0x67c23a;
                break;
        }
    }

    // 下降显示
    private show() {
        this.y -= this.down_len;
        this.alpha = 0;
        egret.Tween.get(this).to({
            y: this.y + this.down_len,
            alpha: 1
        }, 150).call(() => {
            this.timeoutDestory();
        });
    }

    // 定时销毁
    private timeoutDestory() {
        egret.setTimeout(() => {
            egret.Tween.get(this).to({
                y: this.y - this.down_len,
                alpha: 0
            }, 150).call(() => {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            });
        }, this, this.duration);
    }

    // -------------------------- api

    /**
     * 成功提醒
     * @param thisObject 当前的显示对象
     */
    public static success({text, duration}: {
        text: string,
        duration?: number
    }, thisObject: egret.DisplayObjectContainer) {
        return new Message({
            text,
            duration
        }, thisObject);
    }

    /**
     * 错误提醒
     * @param thisObject 当前的显示对象
     */
    public static error({text, duration}: {
        text: string,
        duration?: number
    }, thisObject: egret.DisplayObjectContainer) {
        return new Message({
            text,
            type: 'error',
            duration
        }, thisObject);
    }
}