/*------------------------------------------------------------
IRCbitCar ver1.0.0
------------------------------------------------------------*/



//% weight=0 color=#3333df icon="\uf2db" block="IRC bit Car2"
namespace IRCbitCar {

/*-------------------------------------------------------
関数名：imputMoter
引数：right(number型), left(number型)
  right:右モーターの制御値（-1023から1023）
  left:左モーターの制御値（-1023から1023）

戻り値：無し
内容：左右のモーターを制御する関数
-------------------------------------------------------*/

    /**
    * 左右のモーターを制御します。正の値は正回転、負の値は逆回転になります。
    * @param right 右モーターの制御値（-1023から1023）
    * @param left 左モーターの制御値（-1023から1023）
    */
    //% blockId="input_Moter"
    //% block="左タイヤを $left 、右タイヤを $right の速さで回す"
    //% right.min=-1023 right.max=1023 left.min=-1023 left.max=1023
    //% weight=150
    //% group="動作"

    export function inputMoter(right: number, left: number): void {
        if (right < -1023) {
            right = -1023;
        } else if (right > 1023) {
            right = 1023;
        }

        if (left < -1023) {
            left = -1023;
        } else if (left > 1023) {
            left = 1023;
        }

        if (right < 0) {
            pins.digitalWritePin(DigitalPin.P12, 1);
            pins.digitalWritePin(DigitalPin.P13, 0);
        } else if (right == 0) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P13, 0);
        } else if (right > 0) {
            pins.digitalWritePin(DigitalPin.P12, 0);
            pins.digitalWritePin(DigitalPin.P13, 1);
        }

        if (left < 0) {
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P15, 1);
        } else if (left == 0) {
            pins.digitalWritePin(DigitalPin.P14, 0);
            pins.digitalWritePin(DigitalPin.P15, 0);
        } else if (left > 0) {
            pins.digitalWritePin(DigitalPin.P14, 1);
            pins.digitalWritePin(DigitalPin.P15, 0);
        }

        pins.analogWritePin(AnalogPin.P9, Math.abs(right));
        pins.analogWritePin(AnalogPin.P16, Math.abs(left));
    }


/*-------------------------------------------------------
関数名：stopMoter
引数：無し

戻り値：無し
内容：左右のモーターを停止させる関数
-------------------------------------------------------*/

    /**
    * 左右のモーターを停止します。
    */
    //% blockId="stop_moter"
    //% block="タイヤを停止"
    //% weight=149
    //% group="動作"

    export function stopMoter(): void {
        //右のモーターを停止
        pins.digitalWritePin(DigitalPin.P14, 0);
        pins.digitalWritePin(DigitalPin.P15, 0);
        //左のモーターを停止
        pins.digitalWritePin(DigitalPin.P12, 0);
        pins.digitalWritePin(DigitalPin.P13, 0);
    }


/*-------------------------------------------------------
関数名：getIRVar
引数：無し

戻り値：赤外線の強さ（赤外線の近さを数値化：数値が高ければ近い。）
内容：IRセンサーのアナログ値を500回分取得し、平均を求める関数
-------------------------------------------------------*/

    let sensorValues: number[] = []; // 赤外線センサーを規定数取得-格納する配列
    let averageValue = 0; // 配列sensorValuesの平均値を格納する変数

    /**
    * 赤外線センサーの値を求める関数
    * @returns 赤外線センサー値（赤外線の近さを数値化：数値が高ければ近い。）
    */
    //% blockId="get_IR_ver"
    //% block="赤外線センサー"
    //% weight=130
    //% group="センサー"

    export function getIRVar(): number {
        sensorValues = [];
        for (let i: number = 0; i < 500; i++) {
            let analogValue = pins.analogReadPin(AnalogPin.P0);
            // 読み取った値を配列に追加
            sensorValues.push(analogValue);
        }
        // 500回のセンサー値を取得したら平均値を計算
        let sum = sensorValues.reduce((a, b) => a + b, 0);
        averageValue = 1023 - sum / sensorValues.length;
        // 平均値をシリアルモニターに表示
        // serial.writeValue("Average Value", averageValue);

        return averageValue;
    }



/*-------------------------------------------------------
関数名：getLineVar
引数：無し

戻り値：LINEセンサー値（白色：数値が低い、黒色：数値が高い）
内容：LINEセンサーの値を取得する関数
-------------------------------------------------------*/

    let lineValue = 0; // LINEセンサーの値を格納する変数

    /**
    * LINEセンサーの値を取得する関数
    * @returns LINEセンサー値（白色：数値が低い、黒色：数値が高い）
    */
    //% blockId="get_line"
    //% block="Lineセンサー"
    //% weight=129
    //% group="センサー"

    export function getLineVer(): number {
        // Lineセンサーのアナログ値を読み取る
        lineValue = pins.analogReadPin(AnalogPin.P1);
        // 値をシリアルモニターに表示
        // serial.writeValue("Line Value", lineValue);

        return lineValue;
    }



/*-------------------------------------------------------
関数名：getEchoVar
引数：無し

戻り値：距離（センチメートル単位）
内容：超音波センサを使用して距離を測定し、結果をセンチメートル単位
   で返す関数
-------------------------------------------------------*/

    let trig = DigitalPin.P8; // 超音波センサーのトリガーピン
    let echo = DigitalPin.P2; // 超音波センサーのエコーピン
    let maxCmDistance = 500 // 超音波センサーで取得できる最大距離

    /**
    * 超音波センサを使用して距離を測定し、その結果をセンチメートル単位で返します。
    * @returns 距離（センチメートル単位）
    */
    //% blockId="get_echo_ver"
    //% block="超音波センサー"
    //% weight=128
    //% group="センサー"

    export function getEchoVer(): number {
        // トリガーピンのプルモードを設定
        pins.setPull(trig, PinPullMode.PullNone);

        // トリガーピンをLOWに設定
        pins.digitalWritePin(trig, 0);
        // 2マイクロ秒待機
        control.waitMicros(2);

        // トリガーピンをHIGHに設定して超音波パルスを送信
        pins.digitalWritePin(trig, 1);
        // 10マイクロ秒待機
        control.waitMicros(10);

        // トリガーピンを再びLOWに設定
        pins.digitalWritePin(trig, 0);

        // エコーピンのパルス幅を測定（最大測定距離に基づくタイムアウト付き）
        let d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);
        // 測定結果をセンチメートル単位でシリアル出力
        // serial.writeValue("Echo Value", Math.idiv(d, 58));
        // 測定結果をセンチメートル単位で返す
        return Math.idiv(d, 58);
    }

    /*-------------------------------------------------------
    関数名：readAccel
    引数：shaft(enum型)
    shaft:軸(X軸,Y軸,Z軸)
    
    戻り値：加速度
    内容：加速度を出力する関数
    -------------------------------------------------------*/
    export enum axyz {
        //% block="X軸"
        xShaft = 0x3B,
        //% block="Y軸"
        yShaft = 0x3D,
        //% block="Z軸"
        zShaft = 0x3F,
    }

    /**
     * 加速度を取得します
     */
    //% blockID="read_Accel"
    //% block="加速度センサー $shaft"
    //% weight=127
    //% group="センサー"

    export function readAccel(shaft: axyz) {
        let data = i2cRead(MPU6050_ADDR, shaft, 2)
        let accel = (data[0] << 8) | data[1]
        if (accel >= 32768) {
            accel -= 65536
        }
        return toFixed(accel / 16384 * 9.80665, 2)
    }





/*-------------------------------------------------------
関数名：compusHeadReset
引数：無し

戻り値：無し
内容：基準となる角度を0度に設定する関数（コンパスを使用）


    let baseHeading = 0;　// 基準となる角度

    
    現在向いている方角を0度として設定します。
    
    //% blockId="compus_head_reset"
    //% block="今向いている方向を0にする"
    //% weight=110
    //% group="コンパス"

    export function compusHeadReset(): void {
        baseHeading = input.compassHeading();
    }
-------------------------------------------------------*/




/*-------------------------------------------------------
関数名：getCompusHead
引数：無し

戻り値：基準に対する方角（-180度から180度）
内容：基準に対する現在の方角を取得する関数（コンパスを使用）


    
    基準に対する現在の方角を取得します。
    @returns 基準に対する方角（-180度から180度）
    
    //% blockId="get_compus_head"
    //% block="ロボットの向き（コンパス）"
    //% weight=109
    //% group="コンパス"

    export function getCompusHead(): number {
        let currentHeading = input.compassHeading();
        let relativeHeading = currentHeading - baseHeading;

        // 範囲を-180度から180度に調整
        if (relativeHeading > 180) {
            relativeHeading -= 360;
        } else if (relativeHeading < -180) {
            relativeHeading += 360;
        }

        return relativeHeading;
    }
-------------------------------------------------------*/



/*-------------------------------------------------------
関数名：initMPU6050
引数：sensitivity(enum型)
  sensitivity:センサー感度(250dps,500dps,1000dps,2000dps)
 
戻り値：無し
内容：ジャイロセンサーの起動
-------------------------------------------------------*/

    let MPU6050_ADDR = 0x68
    let yaw = 0
    let roll = 0
    let pitch = 0
    export let yawAngle = 0
    export let rollAngle = 0
    export let pitchAngle = 0
    export let gyroXOffset = 0
    export let gyroYOffset = 0
    export let gyroZOffset = 0
    export let correction = 1
    let sen = 0x08
    export let scaleFactor = 65.5


    export enum gyroSen {
        //% block="250dps"
        range_250_dps,
        //% block="500dps"
        range_500_dps,
        //% block="1000dps"
        range_1000_dps,
        //% block="2000dps"
        range_2000_dps
    }

    export enum onoff {
        //% block="起動"
        power_on,
        //% block="停止"
        power_off
    }

    function i2cWrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cRead(addr: number, reg: number, len: number): Buffer {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE)
        return pins.i2cReadBuffer(addr, len)
    }

    let runInterval = 0;
    let runtime = 0;
    let intervalId: number;

    /**
     * ジャイロセンサーを起動します
     */
    //% blockId="init_MPU6050"
    //% block="ジャイロセンサーを $power"
    //% power.shadow="dropdown"
    //% power.fieldEditor="gridpicker" power.fieldOptions.columns=2
    //% weight=100
    //% group="センサー(ジャイロ)"
    export function initMPU6050(power: onoff) {
        if (power == onoff.power_on) {
            i2cWrite(MPU6050_ADDR, 0x6B, 0x00) // MPU6050を起動する
            i2cWrite(MPU6050_ADDR, 0x1B, sen) // ジャイロの感度を設定する 
            calibrateGyro()
            correction = 1

            if (intervalId) {
                control.clearInterval(intervalId, control.IntervalMode.Interval);
            }
            runtime = input.runningTime()
            intervalId = control.setInterval(function () {
                runInterval = input.runningTime() - runtime
                yawAngle = getYawAngle()
                rollAngle = getRollAngle()
                pitchAngle = getPitchAngle()

                runtime = input.runningTime()
            }, 10, control.IntervalMode.Interval)
        } else {
            i2cWrite(MPU6050_ADDR, 0x6B, 0x40)
            if (intervalId) {
                control.clearInterval(intervalId, control.IntervalMode.Interval);
            }
        }
    }



/*-------------------------------------------------------
関数名：gyroSensorDps
引数：sensitivity(enum型)
  sensitivity:センサー感度(250dps,500dps,1000dps,2000dps)
    
戻り値：無し
内容：ジャイロセンサーの感度を設定できる
-------------------------------------------------------*/

    /**
     * ジャイロセンサーの感度を設定します
     */
    //% blockId="gyro_Sensor_dps"
    //% block="感度を $sensitivity にする"
    //% weight=99
    //% group="センサー(ジャイロ)"

    export function gyroSensorDps(sensitivity: gyroSen) {
        if (sensitivity == gyroSen.range_250_dps) {
            sen = 0x00 // ジャイロの感度を250 deg/secに設定する
            scaleFactor = 131 // ジャイロのスケールファクターを131にする
        } else if (sensitivity == gyroSen.range_500_dps) {
            sen = 0x08 // ジャイロの感度を500 deg/secに設定する
            scaleFactor = 65.5 // ジャイロのスケールファクターを65.5にする
        } else if (sensitivity == gyroSen.range_1000_dps) {
            sen = 0x10 // ジャイロの感度を1000 deg/secに設定する
            scaleFactor = 32.8 // ジャイロのスケールファクターを32.8にする
        } else {
            sen = 0x18 // ジャイロの感度を2000 deg/secに設定する
            scaleFactor = 16.4 // ジャイロのスケールファクターを16.4にする
        }
        i2cWrite(MPU6050_ADDR, 0x1B, sen) // ジャイロの感度を設定する 
        calibrateGyro()
        yaw = 0
    }


/*-------------------------------------------------------
関数名：calibrateGyroZ
引数：無し
    
戻り値：無し
内容：ジャイロセンサーのキャリブレーションを行う関数
-------------------------------------------------------*/

    /**
     * ジャイロセンサーのキャリブレーションを行います
     */
    //% blockId="calibrate_gyro"
    //% block="ジャイロセンサーのキャリブレーション"
    //% weight=98
    //% group="センサー(ジャイロ)"

    export function calibrateGyro() {
        let sumX = 0
        let sumY = 0
        let sumZ = 0
        let count = 1000 // 1秒間のサンプル数
        basic.pause(1000)
        for (let i = 0; i < count; i++) {
            sumX += readGyro(gxyz.xShaft)
            sumY += readGyro(gxyz.yShaft)
            sumZ += readGyro(gxyz.zShaft)
            basic.pause(1) // 1msの間隔でサンプリング
        }
        gyroXOffset = sumX / count
        gyroYOffset = sumY / count
        gyroZOffset = sumZ / count

        yaw = 0
    }





/*-------------------------------------------------------
関数名：readGyro
引数：無し
    
戻り値：角速度
内容：角速度を出力する関数
-------------------------------------------------------*/

    export enum gxyz {
        //% block="X軸"
        xShaft = 0x43,
        //% block="Y軸"
        yShaft = 0x45,
        //% block="Z軸"
        zShaft = 0x47,
    }

    /**
     * ジャイロセンサーで角速度を取得します
     */
    //% blockId="read_Gyro"
    //% block="角速度 $shaft"
    //% weight=96
    //% group="センサー(ジャイロ)"
    
    export function readGyro(shaft: gxyz) {
        let offset = 0
        let data = i2cRead(MPU6050_ADDR, shaft, 2) // Z軸ジャイロデータを読み取る
        let gyro = (data[0] << 8) | data[1]
        if (gyro >= 32768) {
            gyro -= 65536
        }

        if (shaft == gxyz.xShaft) {
            offset = gyroXOffset;
        } else if (shaft == gxyz.yShaft) {
            offset = gyroYOffset;
        } else {
            offset = gyroZOffset
        }

        return Math.round((gyro - offset) / scaleFactor);
 
    }


    /*-------------------------------------------------------
    関数名：get(Yaw/Roll/Pitch)Angle
    引数：無し
    
    戻り値：(ヨー/ロール/ピッチ）回転の回転角（-180度から180度）
    内容：回転角を求める関数
    -------------------------------------------------------*/

    export function getYawAngle(): number {
        let gyroZ = 0
        gyroZ = readGyro(gxyz.zShaft) - gyroZOffset // オフセットを引く
        yaw += gyroZ * runInterval * 0.001 

        return yaw;
    }

    export function getRollAngle(): number {
        let gyroX = 0
        gyroX = readGyro(gxyz.xShaft) - gyroXOffset // オフセットを引く
        roll += gyroX * runInterval * 0.001 
        while (Math.abs(roll) > 180) {
            if (roll < -180) {
                roll += 360
            } else if (roll > 180) {
                roll -= 360
            }
        }

        return roll;
    }

    export function getPitchAngle(): number {
        let gyroY = 0
        gyroY = readGyro(gxyz.yShaft) - gyroYOffset // オフセットを引く
        pitch += gyroY * runInterval * 0.001
        while (Math.abs(pitch) > 180) {
            if (pitch < -180) {
                pitch += 360
            } else if (pitch > 180) {
                pitch -= 360
            }
        }

        return pitch;
    }

/*-------------------------------------------------------
関数名：resetYawAngle
引数：無し

戻り値：無し
内容：ヨー回転の回転角を0にする関数
-------------------------------------------------------*/
    export function resetYawAngle() {
        yaw = 0
    }


/*-------------------------------------------------------
関数名：getInclination
引数：inc(enum型)
    
戻り値：無し
内容：ピッチ、ロール、ヨー角を-180度～180度の値で出力します。
-------------------------------------------------------*/

    export enum pry {
        //% block="ピッチ（前後回転）"
        pitch,
        //% block="ロール（左右回転）"
        roll,
        //% block="ヨー（左右旋回）"
        yaw
    }

    /**
    * ロボットが向いている向きを角度(-180度から180度)で表現します
    */
    //% blockId="angle"
    //% block="$inc"
    //% weight=95
    //% group="センサー(ジャイロ)"

    export function getInclination(inc: pry){
        let k = 0.98
        let aPitch = Math.atan(readAccel(axyz.xShaft) / Math.sqrt(readAccel(axyz.yShaft) ** 2 + readAccel(axyz.zShaft) ** 2)) * 180 / Math.PI
        let aRoll = Math.atan(readAccel(axyz.yShaft) / readAccel(axyz.zShaft)) * 180 / Math.PI 
        let yaw2 = 0
        // let pitch = k * getPitchAngle() + (1 - k) * aPitch
        // let roll = k * getRollAngle() + (1 - k) * aRoll
        if (inc == pry.pitch){
            return aPitch;
        }else　if (inc == pry.roll) {
            return aRoll
        }  else {
            yaw2 = yawAngle * correction
            while (Math.abs(yaw2) > 180) {
                if (yaw2 < -180) {
                    yaw2 += 360
                } else if (yaw2 > 180) {
                    yaw2 -= 360
                }
            }
            return yaw2;
        }
    }




/*-------------------------------------------------------
関数名：correctionYaw()
引数：無し

戻り値：無し
内容：ヨー角度の補正を行います。本体を時計回りに１回転させて、
AボタンとBボタンを同時に押してください。
-------------------------------------------------------*/

    /**
    * ヨー角度の補正を行います。本体を時計回りに１回転させて、AボタンとBボタンを同時に押してください。
    */
    //% blockId="yawcorrection"
    //% block="角度補正"
    //% weight=97
    //% group="センサー(ジャイロ)"

    export function correctionYaw(){
        calibrateGyro();
        basic.showLeds(`
        # # # # .
        # . # . #
        # # # # .
        # . # . #
        # . # # .
        `)
        // ABボタンが同時に押されるまで待機
        while (!(input.buttonIsPressed(Button.A) && input.buttonIsPressed(Button.B))) {
            // ループ内で何もしない
            basic.pause(50); // CPUの負荷を下げるために少し待機
        }
        // ABボタンが同時に押された後の処理
        basic.clearScreen()
        correction = 360 / Math.abs(yawAngle)   
        basic.showNumber(correction)
        calibrateGyro();
    }


/*-------------------------------------------------------
以下、補助用関数
-------------------------------------------------------*/

    export function toFixed(num: number, n: number): number {
        let floatnum
        // 10のn乗を計算
        let factor = Math.pow(10, n);

        // 数値をn位で丸める
        let tempNumber = Math.round(num * factor) / factor;

        // 文字列に変換
        let tempString = tempNumber.toString();

        // 小数点位置を確認
        let dotIndex = tempString.indexOf('.');

        // 小数点がない場合は、小数点と0を追加
        if (dotIndex === -1) {
            tempString += '.';
            dotIndex = tempString.length - 1;
        }

        // 必要な桁数まで0を追加
        while (tempString.length <= dotIndex + n) {
            tempString += '0';

        }

        return parseFloat(tempString);
    }


}
