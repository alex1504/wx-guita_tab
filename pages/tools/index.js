// pages/tools/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        soundNameList: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        typeList: [
            '大三和弦', '小三和弦（*m）', '大七和弦（*7）', '小七和弦（*m7）', '大大七和弦（*maj7）',
            '九和弦（*9）', '六和弦（*6）', '小九和弦（*m9）', '小六和弦（*m6）', '挂四和弦（*sus4）', '挂二和弦（*sus2）', '挂四七和弦（*7sus4）'
        ],
        selectSoundName: 0,
        selectType: 0,
        chordImages: [
            [
                "http://qiniu1.huzerui.com/17-10-12/7443328.jpg",
                "http://qiniu1.huzerui.com/17-10-12/73960254.jpg",
                "http://qiniu1.huzerui.com/17-10-12/11480668.jpg",
                "http://qiniu1.huzerui.com/17-10-12/13170820.jpg",
                "http://qiniu1.huzerui.com/17-10-12/36897061.jpg",
                "http://qiniu1.huzerui.com/17-10-12/99274988.jpg",
                "http://qiniu1.huzerui.com/17-10-12/5412353.jpg",
                "http://qiniu1.huzerui.com/17-10-12/48882124.jpg",
                "http://qiniu1.huzerui.com/17-10-12/78584601.jpg",
                "http://qiniu1.huzerui.com/17-10-12/90245047.jpg",
                "http://qiniu1.huzerui.com/17-10-12/20839242.jpg",
                "http://qiniu1.huzerui.com/17-10-12/29498588.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/63170601.jpg",
                "http://qiniu1.huzerui.com/17-10-12/61376823.jpg",
                "http://qiniu1.huzerui.com/17-10-12/81650243.jpg",
                "http://qiniu1.huzerui.com/17-10-12/65061662.jpg",
                "http://qiniu1.huzerui.com/17-10-12/31323615.jpg",
                "http://qiniu1.huzerui.com/17-10-12/95573792.jpg",
                "http://qiniu1.huzerui.com/17-10-12/59192645.jpg",
                "http://qiniu1.huzerui.com/17-10-12/51372704.jpg",
                "http://qiniu1.huzerui.com/17-10-12/68352926.jpg",
                "http://qiniu1.huzerui.com/17-10-12/71109576.jpg",
                "http://qiniu1.huzerui.com/17-10-12/39609300.jpg",
                "http://qiniu1.huzerui.com/17-10-12/21698288.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/3096234.jpg",
                "http://qiniu1.huzerui.com/17-10-12/12659202.jpg",
                "http://qiniu1.huzerui.com/17-10-12/84862302.jpg",
                "http://qiniu1.huzerui.com/17-10-12/8108038.jpg",
                "http://qiniu1.huzerui.com/17-10-12/46520429.jpg",
                "http://qiniu1.huzerui.com/17-10-12/76972696.jpg",
                "http://qiniu1.huzerui.com/17-10-12/73541638.jpg",
                "http://qiniu1.huzerui.com/17-10-12/16543419.jpg",
                "http://qiniu1.huzerui.com/17-10-12/37342843.jpg",
                "http://qiniu1.huzerui.com/17-10-12/40268112.jpg",
                "http://qiniu1.huzerui.com/17-10-12/17581080.jpg",
                "http://qiniu1.huzerui.com/17-10-12/35808133.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/63953279.jpg",
                "http://qiniu1.huzerui.com/17-10-12/50834467.jpg",
                "http://qiniu1.huzerui.com/17-10-12/53646132.jpg",
                "http://qiniu1.huzerui.com/17-10-12/32784793.jpg",
                "http://qiniu1.huzerui.com/17-10-12/47550787.jpg",
                "http://qiniu1.huzerui.com/17-10-12/88448410.jpg",
                "http://qiniu1.huzerui.com/17-10-12/7256945.jpg",
                "http://qiniu1.huzerui.com/17-10-12/83976597.jpg",
                "http://qiniu1.huzerui.com/17-10-12/84781430.jpg",
                "http://qiniu1.huzerui.com/17-10-12/8351889.jpg",
                "http://qiniu1.huzerui.com/17-10-12/62508613.jpg",
                "http://qiniu1.huzerui.com/17-10-12/72963519.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/8706676.jpg",
                "http://qiniu1.huzerui.com/17-10-12/99975462.jpg",
                "http://qiniu1.huzerui.com/17-10-12/88411059.jpg",
                "http://qiniu1.huzerui.com/17-10-12/31681726.jpg",
                "http://qiniu1.huzerui.com/17-10-12/24409151.jpg",
                "http://qiniu1.huzerui.com/17-10-12/75233115.jpg",
                "http://qiniu1.huzerui.com/17-10-12/61783683.jpg",
                "http://qiniu1.huzerui.com/17-10-12/3538623.jpg",
                "http://qiniu1.huzerui.com/17-10-12/60590914.jpg",
                "http://qiniu1.huzerui.com/17-10-12/82056457.jpg",
                "http://qiniu1.huzerui.com/17-10-12/6004576.jpg",
                "http://qiniu1.huzerui.com/17-10-12/70706612.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/2179359.jpg",
                "http://qiniu1.huzerui.com/17-10-12/75120561.jpg",
                "http://qiniu1.huzerui.com/17-10-12/61217166.jpg",
                "http://qiniu1.huzerui.com/17-10-12/84852184.jpg",
                "http://qiniu1.huzerui.com/17-10-12/64200476.jpg",
                "http://qiniu1.huzerui.com/17-10-12/12171433.jpg",
                "http://qiniu1.huzerui.com/17-10-12/55658360.jpg",
                "http://qiniu1.huzerui.com/17-10-12/52448665.jpg",
                "http://qiniu1.huzerui.com/17-10-12/92251730.jpg",
                "http://qiniu1.huzerui.com/17-10-12/18081196.jpg",
                "http://qiniu1.huzerui.com/17-10-12/99561219.jpg",
                "http://qiniu1.huzerui.com/17-10-12/58673529.jpg",
            ],
            [
                "http://qiniu1.huzerui.com/17-10-12/16642969.jpg",
                "http://qiniu1.huzerui.com/17-10-12/69126498.jpg",
                "http://qiniu1.huzerui.com/17-10-12/38462622.jpg",
                "http://qiniu1.huzerui.com/17-10-12/92142946.jpg",
                "http://qiniu1.huzerui.com/17-10-12/74674002.jpg",
                "http://qiniu1.huzerui.com/17-10-12/74674002.jpg",
                "http://qiniu1.huzerui.com/17-10-12/31184705.jpg",
                "http://qiniu1.huzerui.com/17-10-12/42903192.jpg",
                "http://qiniu1.huzerui.com/17-10-12/94617464.jpg",
                "http://qiniu1.huzerui.com/17-10-12/98884342.jpg",
                "http://qiniu1.huzerui.com/17-10-12/36062637.jpg",
                "http://qiniu1.huzerui.com/17-10-12/62152151.jpg",
            ]
        ]
    },
    changeSoundName(e) {
        this.setData({
            selectSoundName: e.currentTarget.dataset.index
        })
    },
    changeType(e) {
        this.setData({
            selectType: e.currentTarget.dataset.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})