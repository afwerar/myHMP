/**
 * Created by afwerar on 2017/3/20.
 */
var scene, camera,renderer, rouletteScene, controls;
function startGame(){
    console.log('Game started...');
    scene = new THREE.Scene();
    aspect = window.innerWidth/window.innerHeight;
    D = 8;
    camera = new THREE.OrthographicCamera(-D*aspect, D*aspect, D, -D, 1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var light = new THREE.DirectionalLight( 0xffffff, 2 );
    light.position.set( 100, 20, 15 );
    scene.add( light );

    camera.position.set(100,100,100);
    camera.lookAt(new THREE.Vector3(0,0,0));
    camera.rotation.z = 5/6*Math.PI;

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', updateControls );

    var loader = new THREE.ColladaLoader();
    loader.load("/threejs/yuanzhu.dae", function( collada ){
            rouletteScene = collada.scene;
            rouletteScene.scale.set(0.1,0.1,0.1);
            rouletteScene.position.set(5,5,5);
            scene.add(rouletteScene);
            renderer.render(scene, camera);
        },
        function( xhr) {
            console.log((xhr.loaded/xhr.total * 100)+"% loaded");
        });
    //render();
}
function updateControls() {
    renderer.render(scene, camera);
    //controls.update();
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    if( rouletteScene ){
        rouletteScene.rotation.z++;
    }
}