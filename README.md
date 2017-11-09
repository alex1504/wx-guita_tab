# CN:
## 微信小程序·口袋吉他
用微信扫描二维码预览

![小程序二维码](http://qiniu1.huzerui.com/17-10-19/9711670.jpg)

## 项目截图
![view1](http://qiniu1.huzerui.com/17-11-9/6887912.jpg)
![view2](http://qiniu1.huzerui.com/17-11-9/75469062.jpg)
![view3](http://qiniu1.huzerui.com/17-11-9/61787499.jpg)

## 功能说明
- [x] 分页加载及可配置轮播图
- [x] 吉他谱浏览及收藏数据统计
- [x] 吉他谱收藏功能
- [x] 搜索功能
- [x] 吉他和弦查询
- [x] 音频试听（暂未录入数据）
- [x] 评论
- [ ] 分享、保存本地
- [ ] 用户系统
- [ ] 图片加载交互优化

## 项目说明
1. 使用[bmob后端云](https://www.bmob.cn/)提供数据服务
2. 吉他谱数据初始数据使用nodejs爬虫抓取自[17吉他网](http://www.17jita.com/)，爬虫已开启定时任务每周一午夜更新曲谱；由于17吉他网搜索需要权限，因此部分曲谱抓取自[虫虫吉他](http://www.ccguitar.cn/)，已将虫虫吉他谱抓取封装成接口，示例：[http://guita.huzerui.com:3001/search?s=歌曲名或歌手名](http://guita.huzerui.com:3001/search?s=周杰伦)
3. 小程序核心功能是快速搜谱，除谱子外的图片使用[七牛云存储](https://www.qiniu.com/)。
4. 更详细的小程序开发流程请点击[这里]()
5. 若项目对你有所帮助，别忘了**star**一下,你的支持是我前进的动力。

# EN:
## WechatApp·Pocket Guita
Using Wechat to scan the qrcode for preview

![qrcode](http://qiniu1.huzerui.com/17-10-19/9711670.jpg)

## Project Screenshot
![view1](http://qiniu1.huzerui.com/17-11-9/6887912.jpg)
![view2](http://qiniu1.huzerui.com/17-11-9/75469062.jpg)
![view3](http://qiniu1.huzerui.com/17-11-9/61787499.jpg)

## Functions
- [x] Page loading and configurable carousel figure
- [x] Guitar tabs browsing and collection couting
- [x] Guita tabs collecting
- [x] Guita tabs  searching
- [x] Guitar chord query
- [x] Audio listening（Not yet entered data）
- [x] Tabs comments
- [ ] Tabs share and saving
- [ ] User system 
- [ ] Interactive optimization of picture loading

## Project Descriptions
1. Using [bmob](https://www.bmob.cn/) to provide data service
2. Guitar spectrum data using nodejs initial data from [17 Guita Website](http://www.17jita.com/), crawler has opened the timing task every Monday at midnight for update; Dure to search restriction by 17 Guita website, some music scratch from [Chong Chong Guita Website](http://www.ccguitar.cn/), I already make it a interface, for example: [http://guita.huzerui.com:3001/search?s=songName|Singer](http://guita.huzerui.com:3001/search?s=周杰伦/)
3. The app aims at providing easy tabs searching, all images stored in qiniu excepts tabs.
4. More detailed project completion process, please click[here]()
5. If the project is useful for you, don't forget to **star**it, your support is my driving force.

