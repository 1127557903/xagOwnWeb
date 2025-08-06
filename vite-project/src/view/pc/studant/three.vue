<template>
    <div class="equipmentKK">
      <div id="container" ref="container"></div>
      <div class="btns">
        <button @click="updateData">模拟更新数据</button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
  import floorTextureSrc from '@/assets/img/floot.jpg'
  import wallTextureSrc from '@/assets/img/wall.jpg'
  import Stats from 'three/addons/libs/stats.module.js'
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
  import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
  import gsap from "gsap"
  import wittgenstein from "@/assets/model/wittgenstein.glb?url"
  
  const stats: any = new Stats() // 性能监控
  const gltfloader = new GLTFLoader() // 模型加载器
  let scene: any // 场景
  let camera: any // 相机
  let renderer: any // 渲染器
  let composer: any // 效果合成器
  let controls: any // 控制器
  let canvasWidth: any // 画布宽度
  let canvasHeight: any // 画布高度
  let container: any = ref(null) // 容器
  let rect: any // rect 变量的作用是获取容器元素相对于视口的位置信息，主要用于射线投射（Raycasting）中的鼠标坐标转换
  let animationFrameID: any // 动画帧ID
  let tween: any // 动画1
  let tween1: any // 动画2
  
  const textureLoader = new THREE.TextureLoader() // 纹理加载器
  let boardMesh: any = null // 新增：3D看板Mesh
  const myTag = '3D_KanBan' // 看板标签
  
  // 自动动画定时器 记录设备模型 
  const deviceMeshes: any = []
  let boardStartIndex = 0 // 3D 看板元素起始序号
  let kanban3DTimer: any = null // 3D看板定时器
  const durationKanban = 5 // 3D看板动画时长
  let animateTimer: any // 动画定时器
  let isExecution = true // 是否执行动画
  let isAnimating = false // 标记动画开始
  
  // 设备数组
  let deviceArr = [
    { name: '展品1', position: [-10, 2, -40], total: 100, now: 50, status: 1 },
    { name: '展品2', position: [-10, 2, -20], total: 250, now: 30, status: 0 },
    { name: '展品3', position: [-10, 2, 0], total: 130, now: 90, status: 1 },
    { name: '展品4', position: [-10, 2, 20], total: 1000, now: 50, status: 0 },
    { name: '展品5', position: [-10, 2, 40], total: 500, now: 500, status: 1 },
    { name: '展品6', position: [10, 2, 40], total: 200, now: 20, status: 0 },
    { name: '展品7', position: [10, 2, 20], total: 75, now: 55, status: 1 },
    { name: '展品8', position: [10, 2, 0], total: 80, now: 36, status: 1 },
    { name: '展品9', position: [10, 2, -20], total: 60, now: 28, status: 0 },
    { name: '展品10', position: [10, 2, -40], total: 100, now: 10, status: 1 },
  ]
  
  onMounted(() => {
    init()
    container.value.addEventListener('click', clickFn)
    // window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('resize', handleResize) // 监听窗口尺寸变化
    container.value.addEventListener('mousedown', handleMouseDown)
  
  })
  
  onBeforeUnmount(() => {
    // label.element.style.visibility = 'hidden';
    cleanupThreeJS()
    container.value.removeEventListener('click', clickFn)
    // window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('resize', handleResize) // 移除监听
    container.value.removeEventListener('mousedown', handleMouseDown)
    // 滚轮滚动也打断 动画
    window.removeEventListener('wheel', handleMouseDown)
    if (animateTimer) clearInterval(animateTimer)
    if (kanban3DTimer) clearInterval(kanban3DTimer)
  })
  
  // const handleBeforeUnload = (e: any) => {
  //     e.preventDefault()
  //     e.returnValue = ""
  //     cleanupThreeJS()
  // }
  
  // 内存释放 
  const cleanupThreeJS = () => {
    // 停止渲染循环（如果有的话） animationFrameID是requestAnimationFrame的返回值 
    cancelAnimationFrame(animationFrameID)
  
    // 遍历并清理场景中的所有物体  
    scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry?.dispose) child.geometry.dispose()
        if (child.material?.dispose) child.material.dispose()
        if (child.material?.texture?.dispose) child.material.texture.dispose()
      }
      if (child instanceof THREE.Group) child.clear()
      if (child instanceof THREE.Object3D) child.clear()
    })
    renderer.dispose() // 如果你的renderer对象有dispose方法的话  
  }
  
  // 初始化
  const init = () => {
    canvasWidth = container.value.clientWidth
    canvasHeight = container.value.clientHeight
    rect = container.value.getBoundingClientRect()
    initScene()
    initOther()
    initLight()
    initCamera()
    initRenderer(container.value)
    initOrbitControls()
    animation()
    importModel()
  }
  
  // 场景
  const initScene = () => {
    // 初始化一个黑色的场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // 设置背景为黑色
  }
  
  // 相机
  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000)
    camera.position.set(0, 20, 70);
  }
  
  // 渲染器
  const initRenderer = (el: any) => {
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(canvasWidth / canvasHeight) //设置像素比例
    renderer.setSize(canvasWidth, canvasHeight); // 设置渲染尺寸
    el.appendChild(renderer.domElement); // 添加到DOM
  }
  
  // 导入模型
  const importModel = async () => {
    gltfloader.load(wittgenstein, (loader: any) => {
      let Model1 = loader.scene
      for (let i = 0; i < deviceArr.length; i++) {
        let device = deviceArr[i]
        let Model2 = Model1.clone()
        Model2.scale.set(4, 4, 4) // 缩放模型
        Model2.position.set(device.position[0], device.position[1], device.position[2])
        Model2.rotation.set(0, -Math.PI / 2, 0) // 旋转模型
        Model2.name = device.name
        Model2.myTag = myTag
        Model2.status = device.status
        addText(Model2)
        deviceMeshes.push(Model2)
        scene.add(Model2)
      }
      executeKanban()
      // 设置定时器
      kanban3DTimer = setInterval(executeKanban, durationKanban * 1000);
    })
  }
  
  // 添加灯光
  const initLight = () => {
    const light = new THREE.AmbientLight(0x404040, 20); // 柔和的白光
    scene.add(light);
    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 100, 100);
    pointLight.position.set(0, 20, 0);
    pointLight.castShadow = true
    scene.add(pointLight);
  }
  
  // 轨道控制器
  const initOrbitControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.maxDistance = 150; // 设置距离限制
    controls.addEventListener('change', render)
    controls.enablePan = true; // 启用平移
    controls.enableDamping = true // 开启阻尼效果
    controls.dampingFactor = 0.02 // 阻尼系数
    // 自动旋转
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 1
  }
  
  
  // 渲染 
  const render = () => {
    stats.update()
    renderer.render(scene, camera);
    if (composer) {
      composer.render();
    }
  }
  
  // 动画帧
  const animation = () => {
    animationFrameID = requestAnimationFrame(animation)
    controls.update()
    // 让3D看板始终朝向摄像头
    if (boardMesh) {
      // boardMesh.lookAt(camera.position)
    }
    render()
  }
  
  // 查询点击元素的父元素
  const findParentWithName = (object: any) => {
    let parent = object.parent;
    while (parent) {
      // 确保myTag属性存在且匹配
      if (typeof parent.myTag !== 'undefined' && parent.myTag === myTag) {
        // 找到匹配的父元素
        return parent;
      }
      parent = parent.parent;
    }
    // 没有找到匹配的父元素
    return null;
  }
  
  // 点击事件
  const clickFn = (event: any) => {
    event.preventDefault()
  
    rect = container.value.getBoundingClientRect()
    let material = raycaster(event, scene.children)
    if (material.length <= 0) {
      return;
    }
    const findBox3 = scene.children.find((el: any) => el.name == 'surroundingBox')
    if (findBox3) scene.remove(findBox3)
  
    // 移除旧的3D看板
    if (boardMesh) {
      scene.remove(boardMesh)
      boardMesh.geometry.dispose()
      boardMesh.material.map.dispose()
      boardMesh.material.dispose()
      boardMesh = null
    }
  
    const model = findParentWithName(material[0].object)
    if (model) {
      // 打断正在执行的gasp动画
      isExecution = false
      if (tween) {
        tween.kill();
        tween = null;
      }
      if (tween1) {
        tween1.kill();
        tween1 = null;
      }
      // 选中物体发光
      // postRenderer(model)
      controls.autoRotate = false
      const location = model.position
  
      // 新增：创建3D看板
      boardMesh = create3DBoard(model.name)
      boardMesh.position.copy(location)
      boardMesh.position.y += 8 // 放到模型上方
      scene.add(boardMesh)
      // 添加看板的缩放动画
      gsap.to(boardMesh.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: "back.out"
      })
      // 选中物体添加边框
      calculateBoundingBox(model)
      translateCamera(
        new THREE.Vector3(location.x, location.y + 10, location.z + 20),
        new THREE.Vector3(location.x, location.y, location.z)
      )
    } else {
      postRenderer(false)
      // label.element.style.visibility = 'hidden'; // 注释掉2D看板
      // 移除3D看板
      if (boardMesh) {
        scene.remove(boardMesh)
        boardMesh.geometry.dispose()
        boardMesh.material.map.dispose()
        boardMesh.material.dispose()
        boardMesh = null
      }
      isExecution = true
      // controls.autoRotate = true
    }
  }
  
  // 新增：创建3D看板的函数
  const create3DBoard = (text: string) => {
    // 从设备数组中找到当前设备的名称
    const device = deviceArr.find((el: any) => el.name === text);
    // 创建canvas
    const canvas = document.createElement('canvas')
    canvas.width = 316
    canvas.height = 158
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = device?.status == 0 ? 'rgba(32, 147, 246,0.5)' : 'rgba(255, 0, 0,0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'bold 20px Microsoft YaHei'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
  
    // 支持多行文本
    const lines = [
      text,
      '展品状态：' + ((device?.status == 0) ? '展出中' : '未展出'),
      '参观率：' + ((device!.now / device!.total) * 100).toFixed(2) + '%',
      '参观人数：' + device?.now,
      '总人数：' + device?.total,
    ]
    const lineHeight = 30
    const startY = 20
    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight)
    })
  
    // 贴图
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide // 关键：双面可见
    })
    // 需保持和canvas宽高比一致，否则会出现拉伸或压缩
    const geometry = new THREE.PlaneGeometry(10, 5)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = '3dBoard'
    mesh.renderOrder = 999 // 保证在前面
    // mesh.lookAt(camera.position) // 朝向相机
    mesh.scale.set(0, 0, 0) // 初始缩放为0
    return mesh
  }
  
  // 计算包围盒  
  const calculateBoundingBox = (model: any) => {
    const box3 = new THREE.Box3().setFromObject(model);
    // 创建一个线条来显示包围盒（可选）  
    const boxHelper = new THREE.Box3Helper(box3, new THREE.Color(0xffffff));
    boxHelper.name = 'surroundingBox'
    boxHelper.scale.copy(box3.getSize(new THREE.Vector3()));
    scene.add(boxHelper);
  }
  
  const translateCamera = (position: any, target: any, duration = 1): Promise<void> => {
    return new Promise((resolve) => {
      tween = gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: duration,
        ease: "none",
      });
  
      tween1 = gsap.to(controls.target, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: duration,
        ease: "none",
        onComplete: () => resolve() // 动画完成时 resolve Promise
      });
    });
  }
  // 射线拾取
  const raycaster = (event: any, geometrys: any) => {
    const x = ((event.clientX - rect.left) / canvasWidth) * 2 - 1;
    const y = -((event.clientY - rect.top) / canvasHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    return raycaster.intersectObjects(geometrys);
  }
  
  // 后期处理渲染器
  const postRenderer = (mesh: any) => {
    if (!mesh) {
      composer = null
      return
    }
    composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
  
    const v2 = new THREE.Vector2(canvasWidth, canvasHeight)
    const outlinePass = new OutlinePass(v2, scene, camera)
    outlinePass.selectedObjects = [mesh]
    // 将此通道结果渲染到屏幕
    outlinePass.renderToScreen = true;
    outlinePass.edgeGlow = 1; // 发光强度
    outlinePass.usePatternTexture = false; // 是否使用纹理图案
    outlinePass.edgeThickness = 1; // 边缘浓度
    outlinePass.edgeStrength = 2; // 边缘的强度，值越高边框范围越大
    outlinePass.pulsePeriod = 2; // 闪烁频率，值越大频率越低
    outlinePass.visibleEdgeColor.set('#ff0000'); // 呼吸显示的颜色
    outlinePass.hiddenEdgeColor.set('#ffff00'); // 不可见边缘的颜色
    composer.addPass(outlinePass)
  }
  
  // 地面 坐标轴 辅助
  const initOther = () => {
    setTheGround()
    setTheWall()
    // 坐标轴
    // const axesHelper = new THREE.AxesHelper(50)
    // scene.add(axesHelper)
    container.value.appendChild(stats.domElement)
  }
  // 设置地面
  const setTheGround = () => {
    // 创建纹理
    const texture = textureLoader.load(floorTextureSrc)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 10) // 横向重复5次，纵向重复10次
  
    // 添加地面
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 100),
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture,
      }));
    floorMesh.name = 'floor'
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = - Math.PI / 2.0;
    scene.add(floorMesh);
  }
  // 设置墙面
  const setTheWall = () => {
    // 创建纹理
    const texture = textureLoader.load(wallTextureSrc)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 1) // 横向重复5次，纵向重复10次
  
    // 添加墙壁1
    const wallMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 10),
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture,
      }));
    wallMesh.name = 'wall'
    wallMesh.receiveShadow = true;
    wallMesh.rotation.y = - Math.PI / 2.0;
    wallMesh.position.y = 5
    wallMesh.position.x = 25
    // 克隆wallMesh
    const wallMesh1 = wallMesh.clone()
    const wallMesh2 = wallMesh.clone()
    wallMesh2.position.x = -25
    scene.add(wallMesh1);
    scene.add(wallMesh2);
  }
  
  // 为指定物体添加文字标注
  const addText = (obj: any) => {
    // 1. 创建canvas
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'bold 32px Microsoft YaHei'
    ctx.fillStyle = obj.status == 0 ? 'green' : 'red'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(obj.name, canvas.width / 2, canvas.height / 2)
  
    // 2. 创建贴图
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
  
    // 3. 创建平面几何体
    const aspect = canvas.width / canvas.height
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    })
    const textMesh = new THREE.Mesh(geometry, material)
    textMesh.position.copy(obj.position)
    textMesh.position.y = 5
    textMesh.myTag = 'text'
    textMesh.fatherTag = obj.name
    scene.add(textMesh)
  }
  
  const updateData = () => {
    scene.traverse((child: any) => {
      if (typeof child.myTag !== 'undefined' && child.myTag === 'text') {
        // 找到对应设备
        const device = deviceArr.find((d: any) => d.name === child.fatherTag)
        if (!device) return
  
        // 重新绘制canvas
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 64
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.font = 'bold 32px Microsoft YaHei'
        ctx.fillStyle = device.status == 0 ? 'blue' : 'red'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(device.name, canvas.width / 2, canvas.height / 2)
  
        // 更新贴图
        const newTexture = new THREE.CanvasTexture(canvas)
        newTexture.needsUpdate = true
  
        // 释放旧贴图资源
        if (child.material.map) {
          child.material.map.dispose()
        }
        child.material.map = newTexture
        child.material.needsUpdate = true
      }
    })
  }
  
  // 新增：窗口尺寸变化时自适应渲染
  const handleResize = () => {
    if (!container.value || !camera || !renderer) return
    canvasWidth = container.value.clientWidth
    canvasHeight = container.value.clientHeight
    camera.aspect = canvasWidth / canvasHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvasWidth, canvasHeight)
    render()
  }
  
  
  // 新增：鼠标按下时打断gsap动画
  const handleMouseDown = () => {
    if (tween) {
      tween.kill();
      tween = null;
    }
    if (tween1) {
      tween1.kill();
      tween1 = null;
    }
  }
  
  // 使用 async/await
  const autoKanban = async (model: any) => {
    const cameraLocation = model.position
  
    // 先移除旧的内容
    const findBox3 = scene.children.find((el: any) => el.name == 'surroundingBox')
    if (findBox3) scene.remove(findBox3)
  
    // 移除旧的3D看板
    if (boardMesh) {
      scene.remove(boardMesh)
      boardMesh.geometry.dispose()
      boardMesh.material.map.dispose()
      boardMesh.material.dispose()
      boardMesh = null
    }
  
    const location = model.position
  
    // 等待相机动画完成
    await translateCamera(
      new THREE.Vector3(cameraLocation.x, cameraLocation.y + 5, cameraLocation.z + 20),
      new THREE.Vector3(cameraLocation.x, cameraLocation.y, cameraLocation.z)
    )
  
    // 相机动画完成后创建3D看板
    boardMesh = create3DBoard(model.name)
    boardMesh.position.copy(location)
    boardMesh.position.y += 8
    scene.add(boardMesh)
  
    // 添加看板的缩放动画
    gsap.to(boardMesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: "back.out"
    })
  
    // 选中物体添加边框
    calculateBoundingBox(model)
  }
  
  // 修改定时器逻辑
  const executeKanban = async () => {
    if (!isExecution || isAnimating) return // 如果正在执行动画则跳过
    isAnimating = true // 标记开始动画
    await autoKanban(deviceMeshes[boardStartIndex])
    if (boardStartIndex < deviceArr.length - 1) {
      boardStartIndex++
    } else {
      boardStartIndex = 0
    }
    isAnimating = false // 标记动画完成
  }
  
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  
  .equipmentKK {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  #container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .btns {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 999;
  }
  
  button {
    border: none;
    outline: none;
    background-color: #fff;
    padding: 5px 10px;
    margin: 5px;
    cursor: pointer;
  }
  </style>