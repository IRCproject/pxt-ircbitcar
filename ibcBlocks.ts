/*------------------------------------------------------------
IRCbitCar ver.1.0.0

ブロックの形状、順番、カテゴリ分け用のファイルです。
関数の挙動を調整する場合は「ircbitcar.ts」で行ってください。
------------------------------------------------------------*/

//% weight=0 color=#3333df icon="\uf2db" block="IRC bit Car"
namespace robots {




    /**
     * 左右のモーターを制御します。
     * @param right 右モーターの制御値（-1023から1023）
     * @param left 左モーターの制御値（-1023から1023）
     */
    //% blockId="input_Moter"
    //% block="右タイヤを $right 、左タイヤを $left の速さで回す"
    //% right.min=-1023 right.max=1023 left.min=-1023 left.max=1023
    //% weight=109
    //% group="動作"
    export function inputMoter(right: number, left: number): void {
        IRCbitCar.inputMoter(right, left);
    }



    /**
     * 左右のモーターを停止します。
     */
    //% blockId="stop_moter"
    //% block="タイヤを停止"
    //% weight=108
    //% group="動作"
    export function stopMoter(): void {
        IRCbitCar.stopMoter()
    }


    
    /**
     * IRセンサーのアナログ値を500回分取得し、平均を求める関数
     * @returns 平均IRセンサー値（赤外線の近さを数値化：数値が高ければ近い。）
     */
    //% blockId="get_IR_ver"
    //% block="IRセンサー平均値"
    //% weight=99
    //% group="センサー(赤外線・ライン・超音波・コンパス)"
    export function getIRVar():number {
        return IRCbitCar.getIRVar();
    }



    /**
     * LINEセンサーの値を取得する関数
     * @returns LINEセンサー値（白色：数値が低い、黒色：数値が高い）
     */
    //% blockId="get_line"
    //% block="Lineセンサー"
    //% weight=89
    //% group="センサー(赤外線・ライン・超音波・コンパス)"
    export function getLineVer(): number {
        return IRCbitCar.getLineVer();
    }



    /**
     * 超音波センサを使用して距離を測定し、その結果をセンチメートル単位で返します。
     * @returns 距離（センチメートル単位）
     */
    //% blockId="get_echo_ver"
    //% block="超音波センサー"
    //% weight=79
    //% group="センサー(赤外線・ライン・超音波・コンパス)"
    export function getEchoVer(): number {
        return IRCbitCar.getEchoVer();
    }



    /**
     * 現在向いている方角を0度として設定します。
     */
    //% blockId="compus_head_reset"
    //% block="角度をリセット"
    //% weight=69
    //% group="センサー(赤外線・ライン・超音波・コンパス)"
    export function compusHeadReset(): void {
        IRCbitCar.compusHeadReset()
    }



    /**
     * 基準に対する現在の方角を取得します。
     * @returns 基準に対する方角（-180度から180度）
     */
    //% blockId="get_compus_head"
    //% block="角度"
    //% weight=68
    //% group="センサー(赤外線・ライン・超音波・コンパス)"
    export function getCompusHead(): number {
        return IRCbitCar.getCompusHead();
    }



    /**
     * ジャイロセンサーを起動します
     */
    //% blockId="init_MPU6050"
    //% block="ジャイロセンサーを $power"
    //% power.shadow="dropdown"
    //% power.fieldEditor="gridpicker" power.fieldOptions.columns=2
    //% weight=59
    //% group="センサー(ジャイロ)"
    export function initMPU6050(power: IRCbitCar.onoff): void {
        IRCbitCar.initMPU6050(power)
    }


    /**
     * ジャイロセンサーの感度を設定します
     */
    //% blockId="gyro_Sensor_dps"
    //% block="感度を $dps にする"
    //% weight=58
    //% group="センサー(ジャイロ)"
    export function gyroSensorDps(dps: IRCbitCar.gyroSen){
        IRCbitCar.gyroSensorDps(dps)
    }



    /**
     * Z軸ジャイロセンサーのキャリブレーションを行います
     */
    //% blockId="calibrate_gyro_Z"
    //% block="ジャイロセンサーのキャリブレーション"
    //% weight=57
    //% group="センサー(ジャイロ)"
    export function calibrateGyroZ() {
        IRCbitCar.calibrateGyroZ()
    }



    /**
     * ロボットが今向いている向きを0度にします
     */
    //% blockId="reset_yaw_angle"
    //% block="ロボットの向きをリセット"
    //% weight=56
    //% group="センサー(ジャイロ)"
    export function resetYawAngle() {
        IRCbitCar.resetYawAngle()
    }



    /**
     * ジャイロセンサーでZ軸の角速度を取得します
     */
    //% blockId="read_Gyro_Z"
    //% block="Z軸角速度"
    //% weight=55
    //% group="センサー(ジャイロ)"
    export function readGyroZ(){
        return IRCbitCar.readGyroZ() - IRCbitCar.gyroZOffset;
    }



    /**
     * ロボットが向いている向きを角度(-180度から180度)で表現します
     */
    //% blockId="yaw_angle"
    //% block="ロボットの向き"
    //% weight=54
    //% group="センサー(ジャイロ)"
    export function yawAngle(){
        return IRCbitCar.yawAngle;
    }




    


}
