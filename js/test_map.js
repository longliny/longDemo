import { GAMEOPTIONS } from '../js/GameOptions.js';

const Random = Phaser.Math.Between
export default class Map extends Phaser.Scene {

	constructor() {
		super("map")
	}

    preload()
    {
        this.load.json('lv'+level,"assets/level/"+level+".json")
        this.load.plugin('rexraycasterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexraycasterplugin.min.js', true); 
    }

    create()
    {
         lv = this.cache.json.get('lv'+level)
        // //console.log(lv.vBrick)
        
        // UIButton(this)
        createMap(this)
        this.trajectoryGraphics = this.add.graphics();
        //this.input.on("pointerdown", this.startAiming, this);
        //this.input.on("pointerup", this.shootBall, this);
        //this.input.on("pointermove", this.adjustAim, this);
        console.log('aa')

        this.staticObstacles = [
            this.add.rectangle(100, 100, 600, 30, 0x848484).setOrigin(0, 1),
            this.add.rectangle(100, 500, 600, 30, 0x848484).setOrigin(0, 0)
        ]
        this.dynamicObstacles = [
            this.add.rectangle(580, 200, 100, 30, 0xC48434),
            this.add.rectangle(620, 400, 100, 30, 0xC48434).setAngle(90)
        ];
        this.raycaster = this.plugins.get('rexraycasterplugin').add()
            // .addObstacle(this.staticObstacles)
            // .addObstacle(this.dynamicObstacles)
             .addObstacle(lstBlock)

        this.debugGraphics = this.add.graphics();
        this.data
            .set('startX', 360)
            .set('startY', 1100)

        // this.tweens.add({
        //     targets: this.dynamicObstacles,
        //     angle: '+=360',
        //     ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        //     duration: 1000*30,
        //     repeat: -1,           // -1: infinity
        //     yoyo: true
        // });
      
        //this.add.text(0, 580, 'Move touch pointer')
        

    }

    update() {
        //console.log(lstBlock.length)
        this.raycaster.updateObstacle(lstBlock);

        var pointer = this.input.activePointer;
        var x = this.data.get('startX'), 
            y = this.data.get('startY'),
            angle = Phaser.Math.Angle.Between(x, y, pointer.worldX, pointer.worldY);
        RunRaycaster(this.raycaster,
            x, y, angle,
            this.debugGraphics
        );
    }

    getBallPosition() {
 
        // select gallGroup children
        let children = this.ballGroup.getChildren();
 
        // return x and y properties of first child
        return new Phaser.Geom.Point(360, 1100);
    }

    startAiming() {
 
        // are we waiting for player input?
        // if(this.gameState == WAITING_FOR_PLAYER_INPUT) {
 
            // the angle of fire is not legal at the moment
            this.legalAngleOfFire = false;
 
            // change game state because now the player is aiming
            //this.gameState = PLAYER_IS_AIMING;
        //}
    }

    adjustAim(e) {
 
        // is the player aiming?
        // if(this.gameState == PLAYER_IS_AIMING) {
 
            // determine x and y distance between current and initial input
            let distX = e.x - e.downX;
            let distY = e.y - e.downY;
 
            // is y distance greater than 10, that is: is the player dragging down?
            if(distY > 10) {
 
                // this is a legal agne of fire
                this.legalAngleOfFire = true;
 
                // determine dragging direction
                this.direction = Phaser.Math.Angle.Between(e.x, e.y, e.downX, e.downY);
 
                // trajectory direction at the moment is the same as future ball direction
                let trajectoryDirection = this.direction;
 
                // set trajectory length
                let trajectoryLength = 1200
 
                // clear trajectory graphics
                this.trajectoryGraphics.clear();
 
                // set trajectory graphics line style
                this.trajectoryGraphics.lineStyle(1, 0x00ff00);
 
                // get ball bounding box vertices
                this.ballVertices = this.getBallVertices(this.getBallPosition());
 
                // predictive trajectory loop
                do {
 
                    // here we will store all collision information, starting from the distance, initally set as a very high number
                    let collisionObject = {
                        collisionDistance: 10000
                    }
 
                    // loop through all ball vertices
                    this.ballVertices.forEach(function(vertex, index) {
 
                        // determine trajectory line
                        let trajectoryLine = new Phaser.Geom.Line(vertex.x, vertex.y, vertex.x + trajectoryLength * Math.cos(trajectoryDirection), vertex.y + trajectoryLength * Math.sin(trajectoryDirection));
 
                        // iterate through all field segments
                        Phaser.Actions.Call(this.fieldSegments, function(line) {
 
                            // create a new temp point outside game field
                            let intersectionPoint = new Phaser.Geom.Point(-1, -1);
 
                            // assign temp point the valie of the intersection point between trajectory and polygon line, if any
                            Phaser.Geom.Intersects.LineToLine(trajectoryLine, line, intersectionPoint);
 
                            // if the intersection point is inside the field...
                            if(intersectionPoint.x != -1) {
 
                                // determine distance between intersection point and vertex
                                let distance = Phaser.Math.Distance.BetweenPoints(intersectionPoint, vertex);
 
                                // if the distance is less than current collision object distance, but greater than 1, to avoid collision with the line we just checked...
                                if(distance < collisionObject.collisionDistance && distance > 1) {
 
                                    // update collision object distance
                                    collisionObject.collisionDistance = distance;
 
                                    // save collision point
                                    collisionObject.collisionPoint = new Phaser.Geom.Point(intersectionPoint.x, intersectionPoint.y);
 
                                    // save collision angle
                                    collisionObject.collisionAngle = Phaser.Geom.Line.Angle(line);
 
                                    // save collision line
                                    collisionObject.collisionLine = Phaser.Geom.Line.Clone(line);
 
                                    // save vertex index
                                    collisionObject.vertexIndex = index;
                                }
                            }
                        }, this);
                    }.bind(this));
 
                    // if there was a collision point...
                    if(collisionObject.collisionPoint) {
                        // draw a line between the vertex and the collision point
                        this.trajectoryGraphics.lineBetween(this.ballVertices[collisionObject.vertexIndex].x, this.ballVertices[collisionObject.vertexIndex].y, collisionObject.collisionPoint.x, collisionObject.collisionPoint.y);
 
                        // set trajectoryGraphics fill style
                        this.trajectoryGraphics.fillStyle(0xff0000, 0.5);
 
                        // squareOrigin will contain the center of the ball, given the collision point
                        let squareOrigin = new Phaser.Geom.Point();
 
                        // different actions to do according to vertex index
                        switch(collisionObject.vertexIndex) {
 
                            // top left
                            case 0 :
                                this.trajectoryGraphics.fillRect(collisionObject.collisionPoint.x,  collisionObject.collisionPoint.y, this.ballSize, this.ballSize);
                                squareOrigin.x = collisionObject.collisionPoint.x + this.ballSize / 2;
                                squareOrigin.y = collisionObject.collisionPoint.y + this.ballSize / 2;
                                break;
 
                            // top right
                            case 1 :
                                this.trajectoryGraphics.fillRect(collisionObject.collisionPoint.x - this.ballSize,  collisionObject.collisionPoint.y, this.ballSize, this.ballSize);
                                squareOrigin.x = collisionObject.collisionPoint.x - this.ballSize / 2;
                                squareOrigin.y = collisionObject.collisionPoint.y + this.ballSize / 2;
                                break;
 
                            // bottom right
                            case 2 :
                                this.trajectoryGraphics.fillRect(collisionObject.collisionPoint.x - this.ballSize,  collisionObject.collisionPoint.y - this.ballSize, this.ballSize, this.ballSize);
                                squareOrigin.x = collisionObject.collisionPoint.x - this.ballSize / 2;
                                squareOrigin.y = collisionObject.collisionPoint.y - this.ballSize / 2;
                                break;
 
                            // bottom left
                            case 3 :
                                this.trajectoryGraphics.fillRect(collisionObject.collisionPoint.x,  collisionObject.collisionPoint.y - this.ballSize, this.ballSize, this.ballSize);
                                squareOrigin.x = collisionObject.collisionPoint.x + this.ballSize / 2;
                                squareOrigin.y = collisionObject.collisionPoint.y - this.ballSize / 2;
                                break;
                        }
 
                        // determine  new trajectory direction according to surface angle
                        if(Phaser.Math.RadToDeg(collisionObject.collisionAngle) % 180 == 0) {
                            trajectoryDirection = 2 * Math.PI - trajectoryDirection;
                        }
                        else {
                            trajectoryDirection = Math.PI - trajectoryDirection;
                        }
                        trajectoryDirection = Phaser.Math.Angle.Wrap(trajectoryDirection);
 
                        // determine new ball vertices
                        this.ballVertices = this.getBallVertices(squareOrigin);
                    }
 
                    // calculate the lenght of the remaining trajectory
                    trajectoryLength -= collisionObject.collisionDistance;
 
                // keep looping while trajectory length is greater than zero
                } while (trajectoryLength > 0);
            }
 
            // y distance is smaller than 10, that is: player is not dragging down
            else{
 
                // not a legal angle of fire
                this.legalAngleOfFire = false;
 
                // hide trajectory graphics
                this.trajectoryGraphics.clear();
            }
        //}
    }

    addTofieldSegments(rectangle) {
        this.fieldSegments.push(rectangle.getLineA());
        this.fieldSegments.push(rectangle.getLineB());
        this.fieldSegments.push(rectangle.getLineC());
        this.fieldSegments.push(rectangle.getLineD());
    }
    
}
let lstBlock 
let lv
let level = 1
let tileW
let scale =1
let scale_map = 1
let lstColor
let lstColorID
let y
function createMap(scene) {
    lstColor=GAMEOPTIONS.color
    lstColorID = []
    //console.log(lstColor)
    lstBlock=[]
    tileW = 700/lv.nWidth
    if(lv.nWidth>=50) scale = 0.8
    if(lv.nWidth<50) scale = 1
    if(lv.nHeight>=54) y = 1000
    if(lv.nHeight<54) y = 900
    console.log(level)

     //group = scene.add.group();
    var container = scene.add.container(0, 0);


    for (let i = 0; i <lv.vBrick.length; i++) {
        const e = lv.vBrick[i];
        let my_array = e.split(",")
        //map.putTileAt(block_green, my_array[0], my_array[1],24,24);
        let block = scene.add.image(tileDestination(my_array[0])+15, tileDestination(my_array[1]) + 50, "block_white").setScale(scale)
            //group.add(block)
            container.add(block)
            lstBlock.push(block)
        if(my_array[5]==2189591295)
        {
            block.tint='0xB6B6B6' // xam
        }
        else
        {
            let index =lstColorID.indexOf(my_array[5])
            //console.log(index)
            if(index == -1)
            {
                lstColorID.push(my_array[5])
                index =lstColorID.indexOf(my_array[5])
            } 
            
            //let i = Random(0,lstColor.length)
            block.tint=lstColor[index]
        }
        // if(my_array[5]==467861503)block.tint='0x00FFDD' 
        // if(my_array[5]==1373965567)block.tint='0x3EC70B'
        // if(my_array[5]==4239524095)block.tint='0xFF8E00'
        // if(my_array[5]==2957561599)block.tint='0x5800FF'
        // if(my_array[5]==4286648831)block.tint='0xF7FD04'
        
    }   
    console.log(lstColorID)
    //console.log(group.length)
    //container.setAngle(180)
    container.setScale(0.7)
    container.setPosition(0,100)
    //raycaster.addObstacle(lstBlock)
}

function tileDestination(pos) {
    let a = 500- pos * (tileW) 
    return a
}

function  UIButton(scene) {
    let btnNext = scene.add.image(500,1100,'btnNext').setScale(1.5).setInteractive();
        btnNext.on('pointerdown', function (pointer) {
            level++
            scene.scene.restart('map')
        })

    let btnPre = scene.add.image(200,1100,'btnNext').setScale(1.5).setAngle(180).setInteractive();
        btnPre.on('pointerdown', function (pointer) {
            if(level>0)
            {
                level--
                scene.scene.restart('map')
            } 
            
        })
    
}

var RunRaycaster = function (raycaster, x, y, angle, debugGraphics) {
    debugGraphics
        .clear()
        .fillStyle(0xC4C400)
        .fillCircle(x, y, 10);

    const MaxReflectionCount = 2;
    for (var i = 0; i < MaxReflectionCount; i++) {
        var result = raycaster.rayToward(x, y, angle);
        debugGraphics
            .lineStyle(5, 0x840000)
            .strokeLineShape(raycaster.ray);

        if (result) {
            debugGraphics
                .fillStyle(0xff0000)
                .fillPoint(result.x, result.y, 15)

            x = result.x;
            y = result.y;
            angle = result.reflectAngle;
        } else {
            break;
        }
    }
}

