/*------------------------------------------------------------
IRCbitCar ver1.0.0

関数の挙動を調整するファイルです。
ブロックの形状、順番、カテゴリ分けは「ibcBlocks.ts」で行ってください。
------------------------------------------------------------*/

namespace IRCbitCar {

    /*-------------------------------------------------------
    関数名：getIRVar
    引数：無し

    戻り値：平均IRセンサー値（赤外線の近さを数値化：数値が高ければ近い。）
    内容：IRセンサーのアナログ値を500回分取得し、平均を求める関数
    -------------------------------------------------------*/

    let sensorValues: number[] = []; // IRセンサーを規定数取得-格納する配列
    let averageValue = 0; // 配列sensorValuesの平均値を格納する変数

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
    関数名：imputMoter
    引数：right(number型), left(number型)
      right:右モーターの制御値（-1023から1023）
      left:左モーターの制御値（-1023から1023）

    戻り値：無し
    内容：左右のモーターを制御する関数
    -------------------------------------------------------*/

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

    export function stopMoter(): void {
        //右のモーターを停止
        pins.digitalWritePin(DigitalPin.P14, 0);
        pins.digitalWritePin(DigitalPin.P15, 0);
        //左のモーターを停止
        pins.digitalWritePin(DigitalPin.P12, 0);
        pins.digitalWritePin(DigitalPin.P13, 0);
    }



    /*-------------------------------------------------------
    関数名：compusHeadReset
    引数：無し
    
    戻り値：無し
    内容：基準となる角度を0度に設定する関数（コンパスを使用）
    -------------------------------------------------------*/

    let baseHeading = 0;　// 基準となる角度

    export function compusHeadReset(): void {
        baseHeading = input.compassHeading();
    }



    /*-------------------------------------------------------
    関数名：getCompusHead
    引数：無し
    
    戻り値：基準に対する方角（-180度から180度）
    内容：基準に対する現在の方角を取得する関数（コンパスを使用）
    -------------------------------------------------------*/

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



    /*-------------------------------------------------------
    関数名：initMPU6050
    引数：sensitivity(enum型)
      sensitivity:センサー感度(250dps,500dps,1000dps,2000dps)
    
    戻り値：無し
    内容：ジャイロセンサーの起動
    -------------------------------------------------------*/

    let MPU6050_ADDR = 0x68
    let yaw = 0
    export let yawAngle = 0
    let gyroZ = 0
    export let gyroZOffset = 0
    let zSen = 0x00
    let scaleFactor = 131


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


    export function initMPU6050(power: onoff) {
        if (power == onoff.power_on) {
            i2cWrite(MPU6050_ADDR, 0x6B, 0x00) // MPU6050を起動する
            i2cWrite(MPU6050_ADDR, 0x1B, zSen) // ジャイロの感度を設定する 
            calibrateGyroZ()
            if (intervalId) {
                control.clearInterval(intervalId, control.IntervalMode.Interval);
            }
            runtime = input.runningTime()
            intervalId = control.setInterval(function () {
                runInterval = input.runningTime() - runtime
                yawAngle = getYawAngle()
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

    export function gyroSensorDps(sensitivity: gyroSen) {
        if (sensitivity == gyroSen.range_250_dps) {
            zSen = 0x00 // ジャイロの感度を250 deg/secに設定する
            scaleFactor = 131 // ジャイロのスケールファクターを131にする
        } else if (sensitivity == gyroSen.range_500_dps) {
            zSen = 0x08 // ジャイロの感度を500 deg/secに設定する
            scaleFactor = 65.5 // ジャイロのスケールファクターを65.5にする
        } else if (sensitivity == gyroSen.range_1000_dps) {
            zSen = 0x10 // ジャイロの感度を1000 deg/secに設定する
            scaleFactor = 32.8 // ジャイロのスケールファクターを32.8にする
        } else {
            zSen = 0x18 // ジャイロの感度を2000 deg/secに設定する
            scaleFactor = 16.4 // ジャイロのスケールファクターを16.4にする
        }
        i2cWrite(MPU6050_ADDR, 0x1B, zSen) // ジャイロの感度を設定する 
        calibrateGyroZ()
        yaw = 0
    }



    /*-------------------------------------------------------
    関数名：readGyroZ
    引数：無し
    
    戻り値：Z軸の角速度
    内容：Z軸の角速度を出力する関数
    -------------------------------------------------------*/

    export function readGyroZ() {
        let data = i2cRead(MPU6050_ADDR, 0x47, 2) // Z軸ジャイロデータを読み取る
        let gyroZ = (data[0] << 8) | data[1]
        if (gyroZ >= 32768) {
            gyroZ -= 65536
        }
        return gyroZ
    }



    /*-------------------------------------------------------
    関数名：calibrateGyroZ
    引数：無し
    
    戻り値：無し
    内容：ジャイロセンサーのZ軸キャリブレーションを行う関数
    -------------------------------------------------------*/

    export function calibrateGyroZ() {
        let sum = 0
        let count = 1000 // 1秒間のサンプル数
        basic.pause(1000)
        for (let i = 0; i < count; i++) {
            sum += readGyroZ()
            basic.pause(1) // 1msの間隔でサンプリング
        }
        gyroZOffset = sum / count
        yaw = 0
    }



    /*-------------------------------------------------------
    関数名：getYawAngle
    引数：無し
    
    戻り値：ヨー回転の回転角（-180度から180度）
    内容：ヨー回転の回転角を求める関数
    -------------------------------------------------------*/



    export function getYawAngle(): number {
        gyroZ = readGyroZ() - gyroZOffset // オフセットを引く
        yaw += gyroZ * runInterval * 0.00103 / scaleFactor
        while (Math.abs(yaw) > 180) {
            if (yaw < -180) {
                yaw += 360
            } else if (yaw > 180) {
                yaw -= 360
            }
        }

        return yaw;
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



}
