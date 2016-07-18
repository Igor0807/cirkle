'use strict';

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame   || 
    window.mozRequestAnimationFrame      || 
    window.oRequestAnimationFrame        || 
    window.msRequestAnimationFrame       || 
    function(callback, element){
        window.setTimeout(function(){
            callback(+new Date);
        }, 1000 / 60);
    };
})();


(function(){
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var ctx = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var mouseX = 0;
    var mouseY = 0;
    var fps = 0;
    var oldTime = +new Date;
    var isMouseInCircle = false;
    var innerCircleCenterY = centerY;
    var innerCircleCenterX = centerX;

    var MAIN_CIRCLE_RADIUS = 200;
    var INNER_CIRCLE_RADIUS = 25;
    

   
    canvas.addEventListener("mousemove", handleMove);
    

 
    loop(); 
   

   

    function loop(time) {
        window.requestAnimationFrame(loop, canvas);
        fps = 1000/(time-oldTime)
        oldTime = time;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showFPS();
        ctx.beginPath();
        ctx.arc(centerX, centerY,MAIN_CIRCLE_RADIUS,0,2*Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#34648E';
        ctx.stroke();

       
        
        
        drawCircle(innerCircleCenterX, innerCircleCenterY, INNER_CIRCLE_RADIUS); 
        
        
        
        
        isMouseInCircle && drawCircle(mouseX,mouseY, INNER_CIRCLE_RADIUS);  
         /** 
         * temporary helper
         * */
        // if(isMouseInCircle) {
        //     ctx.beginPath();
        //     ctx.moveTo(innerCircleCenterX, innerCircleCenterY);
        //     ctx.strokeStyle = 'red';
        //     ctx.lineTo(mouseX, mouseY);
        //      ctx.lineWidth = 1;
        //     ctx.stroke();
        //     ctx.closePath();

        //     ctx.beginPath();
        //     ctx.moveTo(centerX, centerY);
        //     ctx.strokeStyle = 'blue';
        //     ctx.lineTo(mouseX, mouseY);
        //     ctx.lineWidth = 1;
        //     ctx.stroke();
        //     ctx.closePath();

        //     ctx.beginPath();
        //     ctx.moveTo(centerX, centerY);
        //     ctx.strokeStyle = 'blue';
        //     ctx.lineTo(innerCircleCenterX, innerCircleCenterY);
        //     ctx.lineWidth = 1;
        //     ctx.stroke();
        //     ctx.closePath();

        //     ctx.beginPath();
        //     ctx.arc(centerX, centerY, MAIN_CIRCLE_RADIUS-INNER_CIRCLE_RADIUS, 0, Math.PI*2);
        //     ctx.closePath();
        //     ctx.lineWidth = 1;
        //     ctx.strokeStyle = 'blue';
        //     ctx.stroke();
        // }
    }

    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.fillStyle = '#0294BF';
        ctx.fill();
    }

     function handleMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseInCircle = isPointInCircle(mouseX, mouseY, centerX, centerY, 
            MAIN_CIRCLE_RADIUS-INNER_CIRCLE_RADIUS);
       
        if( isPointIsCloseToCircle(mouseX, mouseY, innerCircleCenterX, innerCircleCenterY, 
            INNER_CIRCLE_RADIUS*2+2)) {
               
            move();
            //    console.log( angle);
        }
    }

    function move () {
         var angleBetweenCircles = calculateAngleRad(mouseX, mouseY, innerCircleCenterX, 
                    innerCircleCenterY);
        var distanceBetwennCircles = caclulateDistanceBetweenPoints(mouseX, mouseY, innerCircleCenterX, 
                    innerCircleCenterY);

        var angleBetweenCenterToMouse = calculateAngleRad(centerX, centerY, mouseX, mouseY);
        var angleBetweenCenterToCircle = calculateAngleRad(centerX, centerY, innerCircleCenterX, innerCircleCenterY);
        var angleBetweenCenterToMouseABS = Math.abs(angleToDeg(angleBetweenCenterToMouse));
        var angleBetweenCenterToCircleABS = Math.abs( angleToDeg(angleBetweenCenterToCircle));
        console.log("ABS", angleBetweenCenterToMouseABS, angleBetweenCenterToCircleABS);
                
        var angleDifference = Math.abs(angleBetweenCenterToMouseABS - angleBetweenCenterToCircleABS);
                console.log("differance",angleDifference, distanceBetwennCircles)
       


            innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles, INNER_CIRCLE_RADIUS*2+2);
            innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles, INNER_CIRCLE_RADIUS*2+2);
            // console.log(getQuoterByAngleRad(angle),angle.toFixed(2));

            if( !isPointInCircle(innerCircleCenterX, innerCircleCenterY, centerX, centerY,  
                    MAIN_CIRCLE_RADIUS-INNER_CIRCLE_RADIUS)) {

                        var quoter = getQuoterByAngleRad(angleBetweenCircles);

     
                 if(angleBetweenCenterToMouse > angleBetweenCenterToCircle) {
                        innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles-0.1, INNER_CIRCLE_RADIUS*2+5);
                        innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles-0.1, INNER_CIRCLE_RADIUS*2+5);
                    } else {
                        innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                        innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                    }
                // if (angleDifference < 15 ) {

                

                //     if(angleBetweenCenterToMouse > angleBetweenCenterToCircle) {
                //         innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles-0.1, INNER_CIRCLE_RADIUS*2+5);
                //         innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles-0.1, INNER_CIRCLE_RADIUS*2+5);
                //     } else {
                //         innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //         innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //     }
                // } else {
                //    if(angleBetweenCenterToMouse > angleBetweenCenterToCircle) {
                //        console.log("::-1")
                //         innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles - 1, INNER_CIRCLE_RADIUS*2+5);
                //         innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles - 1, INNER_CIRCLE_RADIUS*2+5);
                //     } else {
                //         innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles + 1, INNER_CIRCLE_RADIUS*2+5);
                //         innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles + 1, INNER_CIRCLE_RADIUS*2+5);
                //     }  
                // }

                // innerCircleCenterY = getVectorY(mouseY, angle+0.05, INNER_CIRCLE_RADIUS*2+2);
                //     innerCircleCenterX = getVectorX(mouseX, angle+0.05, INNER_CIRCLE_RADIUS*2+2);

                //     if(  quoter === 1 ) {
                //         console.log(angleBetweenCircles.toFixed(2), "sub");
                //     innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //     innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                // }

                //     if(  quoter === 2 ) {
                //         console.log(angleBetweenCircles.toFixed(2), "sub");
                //     innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //     innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                // }

                //     if(  quoter === 3 ) {
                //         console.log(angleBetweenCircles.toFixed(2), "sub");
                //     innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //     innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                // }

                //     if(  quoter === 4 ) {
                //         console.log(angleBetweenCircles.toFixed(2), "sub");
                //     innerCircleCenterY = getVectorY(mouseY, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                //     innerCircleCenterX = getVectorX(mouseX, angleBetweenCircles+0.1, INNER_CIRCLE_RADIUS*2+5);
                // }
                
                                    
            }
    }

    function isPointInCircle(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }

     function isPointIsCloseToCircle(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }

    function showFPS(time){
        ctx.fillStyle = "Black";
        ctx.font      = "normal 14pt Arial";

        ctx.fillText(fps.toFixed(2) + " fps", 10, 26);
    }


    function calculateAngleRad(x1,y1,x2,y2) {
       var dist = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
    //    console.log("DIST:::",dist)
        // return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        return Math.atan2(y2 - y1, x2 - x1);
    }



    function caclulateDistanceBetweenPoints (x1,y1,x2,y2) {
        return   Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
    }

    function getVectorX (x1, angle, length) {
        return x1 + Math.cos(angle) * length;
    };

    function getVectorY (y1, angle, length) {
        return y1 + Math.sin(angle) * length;
    }

    function angleToDeg (angleRadian) {
        return (angleRadian* 180 / Math.PI).toFixed(2);
    }

    function getQuoterByAngleRad(angle) {
       
        if (angle <= Math.PI && angle > Math.PI/2) {
            return 1;
        }

        if (angle <= Math.PI/2 && angle > 0){
            return 2;
        }

         if (angle <= 0 && angle > Math.PI/2 * -1){
            return 3;
        }

        if (angle <= Math.PI/2 * -1  && angle > Math.PI * -1){
            return 4;
        }
    }

    function calculateAgnleOnCirle( ) {

    }
})()

