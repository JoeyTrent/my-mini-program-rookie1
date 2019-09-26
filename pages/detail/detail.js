// pages/detail/detail.js
let datas = require('../../datas/list-data.js')
let appDatas = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailObj: {},
      index: null,
      isCollected: false,
      isMusicPlay: false
  },
  handleCollection(){
    let isCollected = !this.data.isCollected
    this.setData({
        isCollected
    })
    //提示
    let title = isCollected?'收藏成功':'收藏取消'
    wx.showToast({
      title,
      icon: 'susess'
    })

    //缓存数据到本地
    let {index} = this.data
    // let obj = {}
    wx.getStorage({
      key: 'isCollected',
      success: (datas) => {
        let obj =datas.data
        obj[index] = isCollected
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: () => {
            console.log('缓存成功')
          }
        })
      },
    })

   
  },
  
  handleMusicPlay(){
    let isMusicPlay = !this.data.isMusicPlay
    this.setData({
      isMusicPlay
    })
    //音乐控制
    if(isMusicPlay){
    let { dataUrl,title } = this.data.detailObj.music
    wx.playBackgroundAudio({
      dataUrl,
      title
    })}else{
      wx.pauseBackgroundAudio()
    }

  },
  handleShare() {
    wx.showActionSheet({
      itemList: ['分享到朋友圈','分享到qq空间','分享到微博'],
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let index = options.index
      this.setData({
        detailObj: datas.list_data[index],
        index
      })
      //根据缓存 判断是否收藏
      let detailStorage =  wx.getStorageSync('isCollected')

      //空的时候 空对象
      if(!detailStorage){
        wx.setStorageSync('isCollected', {})
      }
      //判断是否收藏过
      if(detailStorage[index]){
        this.setData({
          isCollected: true
        })
      }

      //判断音乐的状态
      if(appDatas.data.isPlay && appDatas.data.pageIndex === index){
          this.setData({
            isMusicPlay: true
          })
      }
      //监听音乐播放
      wx.onBackgroundAudioPlay(() => {
          this.setData({
            isMusicPlay: true
          })
          //修改app的数据
          appDatas.data.isPlay = true
          appDatas.data.pageIndex = index
        console.log(appDatas.data)
      })
      //监听音乐停止
      wx.onBackgroundAudioPause(() => {
        this.setData({
          isMusicPlay: false
        })
        //修改app的数据
        appDatas.data.isPlay = false
        console.log(appDatas.data)
      })
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