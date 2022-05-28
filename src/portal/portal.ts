class Portal extends pc.ScriptType {
  portalA: pc.Entity;

  portalB: pc.Entity;

  sphereA: pc.Entity;

  mainCamera: pc.Entity;

  portalCamera: pc.Entity;

  // 暂存虚拟摄像机的渲染结果
  renderTexture: pc.Texture;

  // 虚拟相机测试
  virtualPerson: pc.Entity;

  aRef = 1;

  bRef = 2;

  initialize() {
    this.portalA = this.app.root.findByName('PortalA') as pc.Entity;
    this.portalB = this.app.root.findByName('PortalB') as pc.Entity;
    this.sphereA = this.app.root.findByName('SphereA') as pc.Entity;
    this.virtualPerson = this.app.root.findByName('VirtualPerson') as pc.Entity;
    this.sphereA.render!.material = new pc.StandardMaterial();
    this.mainCamera = this.app.root.findByName('Camera') as pc.Entity;

    this.portalCamera = this.app.root.findByName('PortalCamera') as pc.Entity;
    const portalCameraComponent = this.portalCamera.camera as pc.CameraComponent;
    // 存放虚拟相机的渲染结果的纹理
    this.renderTexture = new pc.Texture(this.app.graphicsDevice, {
      width: this.app.graphicsDevice.width,
      height: this.app.graphicsDevice.height,
      depth: 24,
    });
    // 虚拟相机渲染出来的内容都存到renderTexture上
    portalCameraComponent.renderTarget = new pc.RenderTarget({
      colorBuffer: this.renderTexture,
    });
    // 为两个传送门的plane设置不同的stencil ref
  }

  // var renders = this.entity.findComponents('render');
  // for (var i = 0; i < renders.length; ++i) {
  //     var meshInstances = renders[i].meshInstances;
  //     for (var j = 0; j < meshInstances.length; j++) {
  //         var material = meshInstances[j].material;
  //         material.diffuseMap = texture;
  //         material.update();
  //     }
  // }
  update() {
    // 获取主相机相对于门A的位置
    const tempVec3 = new pc.Vec3().copy(this.mainCamera.getPosition());
    tempVec3.sub(this.portalA.getPosition());
    // 相对于传送门B的相同位置放置虚拟相机
    this.virtualPerson.setPosition(this.portalB.getPosition().clone().add(tempVec3));
    // this.virtualPerson.setEulerAngles(this.mainCamera.getEulerAngles().mulScalar(-1));
    // 尝试将rendertexture应用到物体上
    if (this.sphereA.render) {
      // eslint-disable-next-line no-restricted-syntax
      for (const meshInstance of this.sphereA.render.meshInstances) {
        const mat = meshInstance.material as any;
        mat.diffuseMap = this.renderTexture;
        mat.update();
      }
    }
  }
}

pc.registerScript(Portal, 'portal');
