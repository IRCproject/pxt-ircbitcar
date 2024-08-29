## 拡張機能として使用

このリポジトリは、MakeCode で **拡張機能** として追加できます。

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **新しいプロジェクト** をクリックしてください
* ギアボタンメニューの中にある **拡張機能** をクリックしてください
* **https://github.com/IRCproject/pxt-ircbitcar** を検索してインポートします。

## このプロジェクトを編集します

MakeCode でこのリポジトリを編集します。

* [https://makecode.microbit.org/](https://makecode.microbit.org/) を開く
* **読み込む** をクリックし、 **URLから読み込む...** をクリックしてください
* **https://github.com/IRCproject/pxt-ircbitcar** を貼り付けてインポートをクリックしてください

#### メタデータ (検索、レンダリングに使用)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

# 説明
この拡張機能はIRCプロジェクトで開発したIRC:bitを使ったプログラミング教育を行うためのロボットです。  
このロボットではモーターとセンサーを使うことで自立型２輪駆動ロボットでサッカーをすることができます。
岩手県滝沢市の小学校の公教育で利用するために開発されています。

## ブロックの説明
### 左右のモーター制御
-1023~1023まであり、  
  - `n = 0` なら停止。  
  - `n > 0` なら正転。  
  - `n < 0` なら反転。  
- 左右の制御を一度に行えます。

### IRセンサー
- RCJJ公式のボールの使用を想定しています。  
- 受信している強さを0~1023で返します。

### ラインセンサー
- 白黒を検知できます。  
- 白と黒の閾値を自身で設定できるようになっています。

### 超音波センサー
- cm単位の距離を返します。

### ジャイロセンサー
- ジャイロセンサーは角度を返します。  
- キャリブレーションは最初に行ってください。  
- 最初にロボットが向いている方向が0です。  
- 角度をリセットすると、今向いている方向が0になります。

---

## Using as an Extension

This repository can be added as an **extension** in MakeCode.

* Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* Click on **New Project**
* Click on **Extensions** in the gear menu
* Search for **https://github.com/IRCproject/pxt-ircbitcar** and import it.

## Editing this Project

You can edit this repository in MakeCode.

* Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* Click on **Import** and then **Import URL...**
* Paste **https://github.com/IRCproject/pxt-ircbitcar** and click on import.

#### Metadata (Used for search and rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

# Description
This extension is developed by the IRC project for programming education using IRC:bit.  
With this robot, you can play soccer using a self-driving two-wheel robot equipped with motors and sensors.
It is being developed for use in public education at an elementary school in Takizawa, Iwate, Japan.

## Block Descriptions
### Motor Control
- The value range is from -1023 to 1023.  
  - `n = 0` means stop.  
  - `n > 0` means forward rotation.  
  - `n < 0` means reverse rotation.
- You can control both motors simultaneously.

### IR Sensor
- Assumes the use of the official RCJJ ball.  
- Returns the signal strength in the range of 0 to 1023.

### Line Sensor
- Can detect black and white.  
- You can set your own threshold for black and white detection.

### Ultrasonic Sensor
- Returns the distance in centimeters.

### Gyro Sensor
- The gyro sensor returns the angle.
- Calibration should be done initially.
- The initial direction the robot faces is set to 0.
- Resetting the angle sets the current direction to 0.
