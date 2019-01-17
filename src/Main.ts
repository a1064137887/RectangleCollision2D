//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    private static _instance: Main;//主类单例
    public static get instance(): Main { return Main._instance; }

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        Main._instance = this;
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;
    private rect1: egret.Bitmap;
    private rect2: egret.Bitmap;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.rect1 = new egret.Bitmap(RES.getRes("red_rect_png"));
        this.rect2 = new egret.Bitmap(RES.getRes("green_rect_png"));
        this.rect1.anchorOffsetX = this.rect1.width / 2;
        this.rect1.anchorOffsetY = this.rect1.height / 2;
        this.rect2.anchorOffsetX = this.rect2.width / 2;
        this.rect2.anchorOffsetY = this.rect2.height / 2;
        this.rect1.x = 300, this.rect1.y = 200;
        this.rect2.x = 300, this.rect2.y = 450;
        this.rect2.rotation = 30;
        this.addChild(this.rect1);
        this.addChild(this.rect2);        
    }

    private dot(vec1: Vector, vec2: Vector)
    {
        return Math.abs(vec1.x * vec2.x + vec1.y * vec2.y);
    }

    /** 获取矩形投影半径 */
    private getProjectionRadius(display, vec, norVec)
    {
        let projectionX = this.dot(vec, norVec[0]);
        let projectionY = this.dot(vec, norVec[1]);

        return display.width / 2 * projectionX + display.height / 2 * projectionY;
        // return projectionX + projectionY;
    }

    private isCollision(obj1: egret.DisplayObject, obj2: egret.DisplayObject)
    {
        let center = new Vector(obj1.x - obj2.x, obj1.y - obj2.y);
        //矩形1的检测轴单位向量
        let obj1Vec = [
            new Vector(Math.cos(obj1.rotation * Math.PI / 180), Math.sin(obj1.rotation * Math.PI / 180)),//x
            new Vector(-Math.sin(obj1.rotation * Math.PI / 180), Math.cos(obj1.rotation * Math.PI / 180)),//y
        ];
        // console.log(obj1Vec);
        //矩形2的检测轴单位向量
        let obj2Vec = [
            new Vector(Math.cos(obj2.rotation * Math.PI / 180), Math.sin(obj2.rotation * Math.PI / 180)),//x
            new Vector(-Math.sin(obj2.rotation * Math.PI / 180), Math.cos(obj2.rotation * Math.PI / 180)),//y
        ];
        // console.log(obj2Vec);
        let vectors = new Array<Vector>();
        vectors.push(obj1Vec[0].normalize());
        vectors.push(obj1Vec[1].normalize());
        vectors.push(obj2Vec[0].normalize());
        vectors.push(obj2Vec[1].normalize());
        // console.log(vectors);

        for(let i = 0; i < vectors.length; i++)
        {
            let project1 = this.getProjectionRadius(obj1, vectors[i], obj1Vec);
            let project2 = this.getProjectionRadius(obj2, vectors[i], obj2Vec);
            let centerPro = this.dot(center, vectors[i]);
            // console.log("第" + (i + 1) + "次检测，矩形1的投影长度：" + project1 + "，矩形2的投影长度：" + project2 + "，中心点的投影长度：" + centerPro)
            if(project1 + project2 <= centerPro)
            {
                return false;
            }
        }
        return true;
    }



}