# Enigma

This is a web-based "Enigma Simulator", reference come from below link.

You can visit [This Project's GitHub Page](http://tsungyi.li/Enigma/) to try this.

![恩格瑪機](http://tsungyi.li/Enigma/images/EnigmaMachine.jpg)

(Image Source: [Flickr](https://www.flickr.com/photos/visualtheology))

**NOTE**: This project was not finished! *Last edit 2015-04-25*


## Reference

* [《模仿游戏》中艾伦·图灵是如何破译英格玛的？](http://www.zhihu.com/question/28397034)

整理相關的資料如下：

### 組件
> * 鍵盤（Keyboard）：輸入密碼用。
> * 燈盤（Lampboard）：輸入一個字母后，燈盤上會有一個字母亮起來，代表經過加密之後的字母。
> * 轉子（Rotor）：是進行加密的部件。
> * 插線板（Plugboard）：將輸入的字母替换成了別的字母。

![恩格瑪機](http://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/EnigmaMachineLabeled.jpg/640px-EnigmaMachineLabeled.jpg)

(Image Source: [Wiki](http://en.wikipedia.org/wiki/Enigma_machine))


### 性質
> 1. 反射器使得恩格瑪機的加密過程是自反的。
> 2. 一個字母加密後的輸出結果絕不會是它自身。

![流程](http://pic2.zhimg.com/222bc15f8af8ba7e60ad31e836cf0a99_b.jpg)

(Image Source: [知乎](http://en.wikipedia.org/wiki/Enigma_rotor_details))


### 轉子
> * 單個轉子對輸入內容所做的本質上是一次單字母替換加密
> * 每加密一個字母就更換一次密碼表
> * 恩格瑪機上使用了三個串聯在一起的轉子
>   * 每輸入一個字母之後，第一個轉子會自動轉動一格。
>   * 第一個轉子轉完一圈後，會帶動第二個轉子轉動一格。
>   * 第二個轉子轉完一圈後，會帶動第三個轉子轉動一格。

![轉子細節](http://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Enigma-action.svg/400px-Enigma-action.svg.png)

(Image Source: [Wiki](http://en.wikipedia.org/wiki/Enigma_machine))


### 密碼本
> 1. 三個轉子的排列順序 (Ex. 三個轉子從左至右編號分別為 2-3-1)
> 2. 三個轉子的位置 (Ex. 三個轉子分別轉動到 X-Y-Z)
> 3. 插線板的設置 (對哪6對字母進行交換)


### 傳送
> 1. 依據今天的密碼本切換轉子的順序(Ex. 2-3-1)與開始的位置(Ex. X-Y-Z)，以及插線板的設置
> 2. 隨機選取三個字母(Ex. IGS)作為本條信息的新密鑰
> 3. 把這三個字母輸入恩格瑪機兩遍 (假設輸出為 MAXONC)
>   * 輸入兩遍是為了避免錯誤
> 4. 把三個轉子的位置分別轉到新密鑰的位置(Ex. I-G-S)上開始發送信息的正文。

* 每天的通訊內容中只有每條信息的前六個字母是用密碼本上的密鑰進行加密的
* 剩下來的內容都是用隨機選出的三個字母加密


### 接收
> 1. 依據今天的密碼本切換轉子的順序(Ex. 2-3-1)與開始的位置(Ex. X-Y-Z)，以及插線板的設置
> 2. 將密碼的前六碼(Ex. MAXONC)輸入恩格瑪機得到新密鑰兩次(Ex. IGSIGS)
> 3. 把三個轉子的位置分別轉到新密鑰的位置(Ex. I-G-S)上開始解密


### 加強安全性
> 1. 1938年9月15日開始，德軍日密鑰中的轉子位置也讓操作員自己選擇。這樣一來，就連每條信息的前六個字母也變成是用不同密鑰加密的了。
> 2. 1938年12月15日，德軍把轉子的數量從三個增加到了五個，安裝的時候從五個裡面隨機選三個安裝在恩格瑪機上，將可能的轉子組合增加了10倍
> 3. 1939年1月1日，德軍把插線板上交換字母的最大數量從6對增加到了10對。
> 4. 1940年5月1日，德軍規定每條信息的信息密鑰只發送一遍，無需重複兩次。
> 5. 後期的恩格瑪機中，德軍又對轉子進行了改造，使得轉子芯外面的​​字母圈可以繞著轉子旋轉。


### 密碼本 (後期)
> 1. 從五個轉子中選擇三個轉子的排列順序 (Ex. 三個轉子從左至右編號分別為 4-3-5)
> 2. 每個轉子外側的字母圈相對於轉子芯的位置
> 3. 插線板的設置 (對哪10對字母進行交換)


### 傳送 (後期)
> 1. 依據今天的密碼本切換轉子的順序(Ex. 2-3-1)，插線板的設置，以及旋轉轉子外側的字母圈相對位置
> 2. 隨機選取轉子初始位置(Ex. X-Y-Z)
>    * 不在密碼本中規定，由操作員選擇，明文發送 
> 3. 隨機選取三個字母(Ex. IGS)作為本條信息的新密鑰
> 4. 把這三個字母輸入恩格瑪機 (假設輸出為 MAX)
> 5. 把三個轉子的位置分別轉到新密鑰的位置(Ex. I-G-S)上開始發送信息的正文。


----
解碼部分省略
