import Bmob from '../utils/bmob';
import Util from '../utils/util.js'

module.exports = {
  getChords(page, limit) {
    page = typeof page == 'undefine' ? 1 : page;
    page = parseInt(page);
    return new Promise((resolve, reject) => {
      let Guita_info = Bmob.Object.extend("guita_chord_info");
      let query = new Bmob.Query(Guita_info);
      limit = typeof limit == 'undefined' ? 10 : parseInt(limit);
      query.limit(limit);
      query.skip((page - 1) * limit);
      query.find({
        success: function (result) {
          result = result.map(obj => {
            return {
              id: obj.id,
              ...obj.attributes
            }
          });
          resolve(result)
        },
        error: function (result, error) {
          console.log(error)
          resolve(error)
        }
      });
    })
  },
  getChordById(id) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.get(id, {
        success: function (result) {
          resolve({
            id: id,
            ...result.attributes
          })
        },
        error: function (result, error) {
          resolve(error)
        }
      });
    })
  },
  searchChord(queryString) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");

      var songQuery = new Bmob.Query(Guita_info);
      songQuery.equalTo("song_name", queryString);

      var authorQuery = new Bmob.Query(Guita_info);
      authorQuery.equalTo("author_name", queryString);

      var mainQuery = Bmob.Query.or(songQuery, authorQuery);


      mainQuery.find({
        success: function (result) {
          result = result.map(obj => {
            return {
              id: obj.id,
              ...obj.attributes
            }
          });
          resolve(result)
        },
        error: function (result, error) {
          resolve(error)
        }
      });
    })
  },
  // 收藏或取消收藏 1：收藏  2：取消收藏
  setCollectNum(id, flag) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.get(id, {
        success: function (res) {
          var num = res.attributes.collect_count;
          num = flag == 1 ? num + 1 : num - 1;
          num = num < 0 ? 0 : num;
          res.set('collect_count', parseInt(num));
          res.save();
          resolve(res);
        },
        error: function (object, error) {
          reject(error);
        }
      });
    })
  },
  getBanner() {
    return new Promise((resolve, reject) => {
      let Banner = Bmob.Object.extend("banner");
      let query = new Bmob.Query(Banner);
      query.find({
        success: function (result) {
          result = result.map(obj => {
            return {
              id: obj.id,
              ...obj.attributes
            }
          });
          resolve(result)
        },
        error: function (result, error) {
          resolve(error)
        }
      });
    })
  },
  // 增加访问统计
  setViewNum(id) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.get(id, {
        success: function (res) {
          var num = res.attributes.view_count;
          num += 1;
          res.set('view_count', parseInt(num));
          res.save();
          resolve(res);
        },
        error: function (object, error) {
          reject(error);
        }
      });
    })
  },
  getComments(songId) {
    return new Promise((resolve, reject) => {
      var Comment = Bmob.Object.extend("comment");

      var query = new Bmob.Query(Comment);
      query.equalTo("songId", songId);

      query.find({
        success: function (result) {
          // console.log(result)
          result = result.map(obj => {
            return {
              id: obj.id,
              createdAt: new Date(obj.createdAt).getTime(),
              createdAtRecent: Util.toRecentStr(new Date(obj.createdAt).getTime()),
              ...obj.attributes
            }
          });
          resolve(result)
        },
        error: function (result, error) {
          resolve(error)
        }
      });
    })
  },
  addComment(obj) {
    return new Promise((resolve, reject) => {
      var Comment = Bmob.Object.extend("comment");
      var comment = new Comment();
      comment.set("songId", obj.songId);
      comment.set("toContent", obj.toContent || "");
      comment.set("toAvatar", obj.toAvatar || "");
      comment.set("to", obj.to || "");
      comment.set("star", 0);
      comment.set("fromAvatar", obj.fromAvatar || "");
      comment.set("from", obj.from || "");
      comment.set("content", obj.content || "");
      comment.save(null, {
        success: function (res) {
          resolve(res)
        },
        error: function (model, error) {
          reject(error)
        }
      });
    })
  },
  // 点赞评论或取消点赞评论 id -> 评论id  flag -> 1：点赞  2：取消点赞
  toggleLoveComment(id, flag) {
    return new Promise((resolve, reject) => {
      var Comment = Bmob.Object.extend("comment");
      var query = new Bmob.Query(Comment);
      query.get(id, {
        success: function (res) {
          var num = res.attributes.star;
          num = flag == 1 ? num + 1 : num - 1;
          num = num < 0 ? 0 : num;
          res.set('star', parseInt(num));
          res.save();
          resolve(res);
        },
        error: function (object, error) {
          reject(error);
        }
      });
    })
  },
}