// from https://github.com/playcanvas/engine/blob/main/scripts/camera/fly-camera.js
class FlyCamera extends pc.ScriptType {
  speed: number;

  fastSpeed: number;

  mode: number;

  sensitive: number;

  eulers: pc.Vec3;

  moved: boolean;

  ex: number; // 俯仰轴旋转

  ey: number; // 偏航轴旋转

  lmbDown: boolean;

  initialize() {
    const eulers = this.entity.getLocalEulerAngles();
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.moved = false;
    this.lmbDown = false;

    // 右键不会打开菜单
    this.app.mouse.disableContextMenu();
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
  }

  update(dt:any) {
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
    let tempSpeed = this.speed;
    // shift加速
    if (this.app.keyboard.isPressed(pc.KEY_SHIFT)) {
      tempSpeed = this.fastSpeed;
    }

    if ((this.app.keyboard.isPressed(pc.KEY_UP)) || (this.app.keyboard.isPressed(pc.KEY_W))) {
      this.entity.translateLocal(0, 0, -tempSpeed * dt);
    } else if ((this.app.keyboard.isPressed(pc.KEY_DOWN)) || (this.app.keyboard.isPressed(pc.KEY_S))) {
      this.entity.translateLocal(0, 0, tempSpeed * dt);
    }

    if ((this.app.keyboard.isPressed(pc.KEY_LEFT)) || (this.app.keyboard.isPressed(pc.KEY_A))) {
      this.entity.translateLocal(-tempSpeed * dt, 0, 0);
    } else if ((this.app.keyboard.isPressed(pc.KEY_RIGHT)) || (this.app.keyboard.isPressed(pc.KEY_D))) {
      this.entity.translateLocal(tempSpeed * dt, 0, 0);
    }
  }

  onMouseMove(e: pc.MouseEvent) {
    // 锁定模式下，鼠标移动则移动
    // 鼠标拖拽移动模式下需要保持左键按下才可移动
    if ((!this.mode && !pc.Mouse.isPointerLocked()) || (this.mode && !this.lmbDown)) {
      return;
    }
    if (!this.moved) {
      // first move event can be very large
      this.moved = true;
      return;
    }
    this.ex -= e.dy * this.sensitive; // 鼠标上下移动作用到俯仰轴上
    this.ey -= e.dx * this.sensitive; // 鼠标左右移动作用到偏航轴上
    this.ex = pc.math.clamp(this.ex, -90, 90); // 俯仰轴限制在-90到90度
  }

  onMouseDown(e: pc.MouseEvent) {
    if (e.button === pc.MOUSEBUTTON_LEFT) {
      this.lmbDown = true;

      // 如果是锁定模式，则尝试锁定鼠标指针
      if (!this.mode && !pc.Mouse.isPointerLocked()) {
        this.app.mouse.enablePointerLock();
      }
    }
  }

  onMouseUp(e: pc.MouseEvent) {
    if (e.button === pc.MOUSEBUTTON_LEFT) {
      this.lmbDown = false;
    }
  }
}

pc.registerScript(FlyCamera, 'flyCamera');
FlyCamera.attributes.add('speed', {
  type: 'number',
  default: 10,
});

FlyCamera.attributes.add('fastSpeed', {
  type: 'number',
  default: 20,
});

FlyCamera.attributes.add('mode', {
  type: 'number',
  default: 0,
  enum: [
    {
      Lock: 0,
    }, {
      Drag: 1,
    },
  ],
});
FlyCamera.attributes.add('sensitive', {
  type: 'number',
  default: 0.2,
});
