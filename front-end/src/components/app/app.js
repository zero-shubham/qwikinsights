import React, {useState} from "react";

import Topboard from "./topboard/topboard";
import Sideboard from "./sideboard/sideboard";
import Canvas from "./canvas";

const App = (props) => {
    const [classSlide, changeSlide] = useState({
        col1: window.screen.availWidth>800?"app__col1":"app__col1 mobile", 
        col2: window.screen.availWidth>800?"app__col2":"app__col2 mobile"
    });

    const [touch,changeTouch] = useState({touchStartX:0,touchMoveX:0,touchStartY:0, touchMoveY:0});

    const recursiveGetParents = (element, arr) => {
        if(element && !Array(...element.classList).includes("app")){
            arr.push(...element.classList);
            recursiveGetParents(element.parentNode, arr)
        }
    }

    const funcTouchChange = (key1,x,key2,y) => {
        let obj = {...touch};
        obj[key1] = x;
        obj[key2] = y;
        changeTouch(obj);
    }

    const handleTouchEnd = () => {
        if(Math.abs(touch.touchStartX-touch.touchMoveX) > Math.abs(touch.touchStartY-touch.touchMoveY) && 
            Math.abs(touch.touchStartX-touch.touchMoveX)>30 && 
            Math.abs(touch.touchStartY-touch.touchMoveY)<30 && touch.touchMoveX){
                if(touch.touchStartX-touch.touchMoveX < 0){
                    let obj = {...classSlide};
                    obj.col1 = "app__col1 mobile";
                    obj.col2 = "app__col2 mobile";
                    changeSlide(obj);
                }else if(touch.touchStartX-touch.touchMoveX > 0){
                    let obj = {...classSlide};
                    obj.col1 = "app__col1 mobile slide";
                    obj.col2 = "app__col2 mobile slide";
                    changeSlide(obj);
                }
        }
    }


    return (
        <div className="app" onTouchStart={(e)=>{
            let classList =  [];
            recursiveGetParents(e.nativeEvent.targetTouches[0].target, classList);
            if(classList.includes("app__col2")){
                funcTouchChange("touchStartX",e.nativeEvent.targetTouches[0].clientX,"touchStartY",e.nativeEvent.targetTouches[0].clientY);
            }else{
                funcTouchChange("touchStartX",0,"touchStartY",0);
            }
        }} onTouchMove={
            (e) => {
                if(e.nativeEvent.targetTouches[0].target.classList.value){
                    funcTouchChange("touchMoveX",e.nativeEvent.targetTouches[0].clientX, "touchMoveY", e.nativeEvent.targetTouches[0].clientY);
                }else{
                    funcTouchChange("touchMoveX",0, "touchMoveY", 0);
                }
            }
        } onTouchEnd= {handleTouchEnd}>
            <div className={classSlide.col1}>
                <Topboard />
                <Canvas/>
            </div>
            <div className={classSlide.col2}>
                <Sideboard disp={classSlide.col2==="app__col2 mobile"?`none`:`ok`}/>
            </div>
        </div>
    )
};

export default App;
